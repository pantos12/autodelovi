import { BaseScraper, fetchHTML } from '../base';
import type { ScrapedPart, ScrapeConfig } from '../../types';

// ProdajaDelova.rs — Inspira Grupa's auto parts platform

const CONFIG: ScrapeConfig = {
  type: 'html',
  base_url: 'https://www.prodajadelova.rs',
  rate_limit_ms: 2000,
  pagination: { type: 'page_number', param: 'page', max_pages: 10 },
};

const CATEGORY_PATHS = [
  { path: '/auto-delovi/filteri',    hint: 'filters',      label: 'Filteri' },
  { path: '/auto-delovi/kocnice',    hint: 'brakes',       label: 'Kocnice' },
  { path: '/auto-delovi/amortizeri', hint: 'suspension',   label: 'Amortizeri' },
  { path: '/auto-delovi/elektrika',  hint: 'electrical',   label: 'Elektrika' },
  { path: '/auto-delovi/motor',      hint: 'engine',       label: 'Motor' },
  { path: '/auto-delovi',            hint: '',             label: 'Svi delovi' },
];

const CATEGORY_KEYWORDS = [
  { keywords: ['filter', 'ulje', 'vazduh', 'gorivo'], hint: 'filters' },
  { keywords: ['disk', 'kocnic', 'plocic', 'bubanj'], hint: 'brakes' },
  { keywords: ['amortizer', 'opruga', 'stabilizator'], hint: 'suspension' },
  { keywords: ['svecic', 'alternator', 'starter', 'paljenje'], hint: 'electrical' },
  { keywords: ['kvacilo', 'zamajac'], hint: 'clutch' },
  { keywords: ['termostat', 'hladnjak', 'pumpa vode'], hint: 'cooling' },
  { keywords: ['karoserija', 'vrata', 'hauba', 'blatobran'], hint: 'body' },
  { keywords: ['menjac', 'kardano'], hint: 'transmission' },
];

const KNOWN_BRANDS = ['Bosch','SKF','Monroe','Brembo','NGK','Febi','Mann','Mahle','Sachs','TRW','Denso','Delphi','Valeo','Continental','Gates','Ate','LUK','INA','Hella','Filtron','KYB','Bilstein'];

function guessCategoryHint(text) {
  const lower = text.toLowerCase();
  for (const cat of CATEGORY_KEYWORDS) {
    if (cat.keywords.some(k => lower.includes(k))) return cat.hint;
  }
  return '';
}

function extractBrandFromText(text) {
  for (const brand of KNOWN_BRANDS) {
    if (new RegExp('\\b' + brand + '\\b', 'i').test(text)) return brand;
  }
  return '';
}

function findProductArrays(obj, depth) {
  if (depth > 5) return [];
  if (Array.isArray(obj) && obj.length > 0) {
    const first = obj[0];
    if (first && typeof first === 'object' && (first.name || first.naziv || first.title) && (first.price || first.cena)) return obj;
  }
  if (obj && typeof obj === 'object') {
    for (const val of Object.values(obj)) {
      const found = findProductArrays(val, depth + 1);
      if (found.length > 0) return found;
    }
  }
  return [];
}

function parseProductsFromHTML(html, categoryHint, baseUrl, supplierId) {
  const parts = [];
  const now = new Date().toISOString();
  const seen = new Set();

  // Strategy 1: JSON-LD
  const jsonLdRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = jsonLdRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(m[1]);
      const items = Array.isArray(data) ? data : data['@type'] === 'ItemList' ? (data.itemListElement || []).map(i => i.item || i) : data['@type'] === 'Product' ? [data] : [];
      for (const p of items) {
        if (p['@type'] !== 'Product') continue;
        const offer = Array.isArray(p.offers) ? p.offers[0] : p.offers;
        if (!p.name || !offer?.price) continue;
        const key = p.name + offer.price;
        if (seen.has(key)) continue;
        seen.add(key);
        const url = offer?.url || p.url || '';
        const img = Array.isArray(p.image) ? p.image[0] : (p.image || '');
        parts.push({ raw_name: p.name, raw_price: `${offer.price} ${offer.priceCurrency || 'RSD'}`, part_number: p.sku || p.mpn || '', oem_number: p.gtin || '', brand: (typeof p.brand === 'string' ? p.brand : p.brand?.name) || extractBrandFromText(p.name), category_hint: categoryHint || guessCategoryHint(p.name), description: p.description || '', image_urls: img ? [img] : [], product_url: url.startsWith('http') ? url : (url ? `${baseUrl}${url}` : ''), stock: (offer?.availability || '').includes('InStock') ? '10' : '0', supplier_id: supplierId, scraped_at: now });
      }
    } catch (e) {}
  }
  if (parts.length > 0) return parts;

  // Strategy 2: Embedded JS data
  const jsDataRe = /(?:window\.__(?:INITIAL_STATE|DATA|STORE|NUXT)__|var\s+initialData)\s*=\s*(\{[\s\S]{100,}?\});/gi;
  let jm;
  while ((jm = jsDataRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(jm[1]);
      const productArrays = findProductArrays(data, 0);
      for (const product of productArrays) {
        const name = product.name || product.naziv || product.title || '';
        const price = product.price || product.cena || '';
        if (!name || !price) continue;
        const key = name + price;
        if (seen.has(key)) continue;
        seen.add(key);
        parts.push({ raw_name: name, raw_price: `${price} RSD`, part_number: product.sku || product.partNumber || '', brand: product.brand || product.manufacturer || extractBrandFromText(name), category_hint: categoryHint || guessCategoryHint(name), description: product.description || '', image_urls: product.image ? [product.image] : (product.thumbnail ? [product.thumbnail] : []), product_url: product.url || '', stock: String(product.stock || product.qty || '1'), supplier_id: supplierId, scraped_at: now });
      }
    } catch (e) {}
  }
  if (parts.length > 0) return parts;

  // Strategy 3: Generic card parsing
  const CARD_RE = /(<(?:div|article|li)[^>]+class=["'][^"']*(?:product|item|card|listing|rezultat)[^"']*["'][^>]*>)([\s\S]{50,3000}?)(?=<(?:div|article|li)[^>]+class=["'][^"']*(?:product|item|card|listing|rezultat)|\s*<\/(?:div|ul|section)>)/gi;
  let cm2;
  while ((cm2 = CARD_RE.exec(html)) !== null) {
    const block = cm2[0];
    const urlM = block.match(/href=["']([^"']+)["']/i);
    if (!urlM) continue;
    const rawUrl = urlM[1];
    const pUrl = rawUrl.startsWith('http') ? rawUrl : `${baseUrl}${rawUrl}`;
    if (seen.has(pUrl)) continue;
    const priceM = block.match(/(\d[\d.,\s]{2,})\s*(?:RSD|din|EUR)/i);
    if (!priceM) continue;
    const nameM = block.match(/<(?:h[1-6]|a)[^>]*>([^<]{5,200})<\/(?:h[1-6]|a)>/i);
    if (!nameM) continue;
    const imgM = block.match(/<img[^>]+(?:src|data-src)=["']([^"']+)["']/i);
    seen.add(pUrl);
    const rawName = nameM[1].trim();
    parts.push({ raw_name: rawName, raw_price: priceM[0].trim(), brand: extractBrandFromText(rawName), category_hint: categoryHint || guessCategoryHint(rawName), description: '', image_urls: imgM ? [imgM[1].startsWith('http') ? imgM[1] : `${baseUrl}${imgM[1]}`] : [], product_url: pUrl, stock: /nema|out.of.stock/i.test(block) ? '0' : '5', supplier_id: supplierId, scraped_at: now });
  }
  return parts;
}

export class ProdajaDelovaScraper extends BaseScraper {
  constructor(supplierId, supplierName = 'ProdajaDelova.rs') {
    super(supplierId, supplierName, CONFIG);
  }

  async fetchParts(maxPages = 5) {
    const allParts = [];
    const seen = new Set();
    const baseUrl = 'https://www.prodajadelova.rs';

    for (const category of CATEGORY_PATHS) {
      this.log(`Scraping: ${category.label}`);
      const catParts = await this.scrapeCategory(category, maxPages, baseUrl);
      for (const part of catParts) {
        const key = part.product_url || `${part.raw_name}-${part.raw_price}`;
        if (!seen.has(key)) { seen.add(key); allParts.push(part); }
      }
      await this.delay();
    }
    this.totalFetched = allParts.length;
    this.log(`Total: ${allParts.length} parts`);
    return allParts;
  }

  async scrapeCategory(category, maxPages, baseUrl) {
    const parts = [];
    for (let page = 1; page <= maxPages; page++) {
      const url = page === 1 ? `${baseUrl}${category.path}` : `${baseUrl}${category.path}?page=${page}`;
      try {
        this.log(`  Page ${page}: ${url}`);
        const html = await fetchHTML(url);
        const pageParts = parseProductsFromHTML(html, category.hint, baseUrl, this.supplierId);
        this.log(`  Found ${pageParts.length} parts`);
        if (pageParts.length === 0) break;
        parts.push(...pageParts);
        if (!html.includes(`page=${page + 1}`) && !html.includes('rel="next"') && page > 1) break;
        await this.delay();
      } catch (err) { this.logError(`${category.path} p${page}: ${err.message}`); break; }
    }
    return parts;
  }
}

export default ProdajaDelovaScraper;
