import { BaseScraper, fetchHTML } from '../base';
import type { ScrapedPart, ScrapeConfig } from '../../types';

// Halo Oglasi — Serbia's largest classifieds platform
// URL: https://www.halooglasi.com/vozila/delovi-i-oprema?stranica={n}

const CONFIG: ScrapeConfig = {
  type: 'html',
  base_url: 'https://www.halooglasi.com',
  rate_limit_ms: 2000,
  pagination: { type: 'page_number', param: 'stranica', max_pages: 10 },
};

const CATEGORY_KEYWORDS = [
  { keywords: ['filter', 'ulje', 'vazduh', 'gorivo', 'kabina'], hint: 'filters' },
  { keywords: ['disk', 'kocnic', 'plocic', 'bubanj'], hint: 'brakes' },
  { keywords: ['amortizer', 'opruga', 'stabilizator', 'trapez'], hint: 'suspension' },
  { keywords: ['svecic', 'paljenje', 'bobina', 'alternator', 'starter'], hint: 'electrical' },
  { keywords: ['kvacilo', 'zamajac', 'potisni'], hint: 'clutch' },
  { keywords: ['pumpa vode', 'termostat', 'hladnjak', 'rashladn'], hint: 'cooling' },
  { keywords: ['kaisni', 'kaish', 'razvodni'], hint: 'timing' },
  { keywords: ['karoserija', 'vrata', 'hauba', 'blatobran', 'branik'], hint: 'body' },
  { keywords: ['menjac', 'kardano', 'diferencial'], hint: 'transmission' },
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

function parseListingsFromHTML(html, baseUrl, supplierId) {
  const parts = [];
  const now = new Date().toISOString();
  const seen = new Set();

  // Strategy 1: JSON-LD
  const jsonLdRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = jsonLdRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(m[1]);
      const items = data['@type'] === 'ItemList' ? (data.itemListElement || []).map(i => i.item || i) : data['@type'] === 'Product' ? [data] : [];
      for (const p of items) {
        if (p['@type'] !== 'Product' || !p.name || !p.offers?.price) continue;
        const url = p.url || '';
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
        if (seen.has(fullUrl)) continue;
        seen.add(fullUrl);
        const img = p.image ? (Array.isArray(p.image) ? p.image[0] : p.image) : '';
        parts.push({ raw_name: p.name, raw_price: `${p.offers.price} RSD`, brand: extractBrandFromText(p.name), category_hint: guessCategoryHint(p.name + ' ' + (p.description || '')), description: p.description || '', image_urls: img ? [img] : [], product_url: fullUrl, stock: '1', supplier_id: supplierId, scraped_at: now });
      }
    } catch (e) {}
  }
  if (parts.length > 0) return parts;

  // Strategy 2: Card patterns
  const PATTERNS = [
    /(<(?:div|li|article)[^>]+class=["'][^"']*(?:product-item|classified-item|oglas-item|fi-holder)[^"']*["'][^>]*>)([\s\S]{50,3000}?)(?=<(?:div|li|article)[^>]+class=["'][^"']*(?:product-item|classified-item|oglas-item|fi-holder))/gi,
    /(<(?:div|li|article)[^>]+data-id=["'][^"']*["'][^>]*>)([\s\S]{50,2000}?)(?=<(?:div|li|article)[^>]+data-id)/gi,
  ];
  for (const pattern of PATTERNS) {
    pattern.lastIndex = 0;
    let cm2;
    while ((cm2 = pattern.exec(html)) !== null) {
      const block = cm2[0];
      const urlM = block.match(/href=["'](\/vozila\/[^"'?#]+)["']/i);
      if (!urlM) continue;
      const pUrl = `${baseUrl}${urlM[1]}`;
      if (seen.has(pUrl)) continue;
      const titleM = block.match(/<(?:h[1-6]|a)[^>]*class=["'][^"']*(?:title|name|naslov)[^"']*["'][^>]*>([^<]{5,200})</i) || block.match(/<(?:h[1-6])[^>]*>([^<]{5,200})<\/h[1-6]>/i) || block.match(/<a[^>]*>([^<]{10,150})<\/a>/i);
      const priceM = block.match(/(\d[\d.\s]{2,})\s*(?:RSD|din)/i);
      if (!titleM || !priceM) continue;
      const imgM = block.match(/<img[^>]+(?:src|data-src)=["']([^"']+(?:jpg|jpeg|png|webp)[^"']*)["']/i);
      seen.add(pUrl);
      const rawName = titleM[1].trim();
      parts.push({ raw_name: rawName, raw_price: priceM[0].trim(), brand: extractBrandFromText(rawName), category_hint: guessCategoryHint(rawName), description: '', image_urls: imgM ? [imgM[1].startsWith('http') ? imgM[1] : `${baseUrl}${imgM[1]}`] : [], product_url: pUrl, stock: '1', supplier_id: supplierId, scraped_at: now });
    }
    if (parts.length > 0) break;
  }

  // Strategy 3: Broad link extraction
  if (parts.length === 0) {
    const links = [...html.matchAll(/href=["'](\/vozila\/delovi-i-oprema\/[^"'?#]+)["']/gi)];
    for (const lm of links) {
      const fullUrl = `${baseUrl}${lm[1]}`;
      if (seen.has(fullUrl)) continue;
      const idx = html.indexOf(lm[0]);
      const block = html.slice(Math.max(0, idx - 200), idx + 400);
      const nameM = block.match(/<[^>]+>([^<]{10,150})<\/[^>]+>/);
      const priceM = block.match(/(\d[\d.\s]{2,})\s*(?:RSD|din)/i);
      if (!nameM || !priceM) continue;
      seen.add(fullUrl);
      const rawName = nameM[1].trim();
      parts.push({ raw_name: rawName, raw_price: priceM[0].trim(), brand: extractBrandFromText(rawName), category_hint: guessCategoryHint(rawName), description: '', image_urls: [], product_url: fullUrl, stock: '1', supplier_id: supplierId, scraped_at: now });
    }
  }

  return parts;
}

export class HaloOglasiScraper extends BaseScraper {
  constructor(supplierId, supplierName = 'Halo Oglasi') {
    super(supplierId, supplierName, CONFIG);
  }

  async fetchParts(maxPages = 5) {
    const allParts = [];
    const seen = new Set();
    const baseUrl = 'https://www.halooglasi.com';

    for (let page = 1; page <= maxPages; page++) {
      const url = `${baseUrl}/vozila/delovi-i-oprema?stranica=${page}`;
      try {
        this.log(`Page ${page}: ${url}`);
        const html = await fetchHTML(url);
        const pageParts = parseListingsFromHTML(html, baseUrl, this.supplierId);
        this.log(`Found ${pageParts.length} listings`);
        if (pageParts.length === 0) break;
        for (const p of pageParts) {
          const key = p.product_url || p.raw_name;
          if (!seen.has(key)) { seen.add(key); allParts.push(p); }
        }
        if (!html.includes(`stranica=${page + 1}`)) break;
        await this.delay();
      } catch (err) { this.logError(`Page ${page}: ${err.message}`); break; }
    }
    this.totalFetched = allParts.length;
    this.log(`Total: ${allParts.length} listings`);
    return allParts;
  }
}

export default HaloOglasiScraper;
