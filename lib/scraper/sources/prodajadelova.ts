/**
 * ProdajaDelova.rs Scraper
 * Targets: https://www.prodajadelova.rs — Inspira Grupa's auto parts platform
 *
 * URL patterns (from indexed pages):
 *   Listing: /auto-delovi (or similar category pages)
 *   Parts typically organized by category and vehicle compatibility
 *
 * This scraper uses multiple parsing strategies to handle both
 * SSR-rendered content and embedded JSON/structured data.
 */

import { BaseScraper, fetchHTML, extractPrice, slugify } from '../base';
import type { ScrapedPart, ScrapeConfig } from '../../types';
import type { ScrapedPartWithSignal, StockSignalStrength } from './autohub';

const PD_STRONG_POS_RE = /na\s*stanju|in\s*stock|dostupno|raspolo[zž]ivo/i;
const PD_NEGATIVE_RE = /nema\s*na\s*stanju|rasprodato|po\s*porud[zž]bini|nedostupno|out\s*of\s*stock|prodato/i;

const CONFIG: ScrapeConfig = {
  type: 'html',
  base_url: 'https://www.prodajadelova.rs',
  rate_limit_ms: 2000,
  pagination: { type: 'page_number', param: 'page', max_pages: 10 },
};

const CATEGORY_PATHS = [
  { path: '/auto-delovi/filteri',     hint: 'filters',      label: 'Filteri' },
  { path: '/auto-delovi/kocnice',     hint: 'brakes',       label: 'Kočnice' },
  { path: '/auto-delovi/amortizeri',  hint: 'suspension',   label: 'Amortizeri' },
  { path: '/auto-delovi/elektrika',   hint: 'electrical',   label: 'Elektrika' },
  { path: '/auto-delovi/motor',       hint: 'engine',       label: 'Motor' },
  { path: '/auto-delovi',             hint: '',             label: 'Svi delovi' },
];

const KNOWN_BRANDS = [
  'Bosch', 'SKF', 'Monroe', 'Brembo', 'NGK', 'Febi', 'Mann', 'Mahle', 'Sachs', 'TRW',
  'Denso', 'Delphi', 'Valeo', 'Continental', 'Gates', 'Ate', 'LUK', 'INA', 'Hella',
  'Pierburg', 'Lemforder', 'Moog', 'KYB', 'Bilstein', 'Filtron',
];

const CATEGORY_KEYWORDS: Array<{ keywords: string[]; hint: string }> = [
  { keywords: ['filter', 'ulje', 'vazduh', 'gorivo', 'kabina'], hint: 'filters' },
  { keywords: ['disk', 'kočnic', 'kocnic', 'pločic', 'plocic', 'bubanj'], hint: 'brakes' },
  { keywords: ['amortizer', 'opruga', 'stabilizator', 'trapez'], hint: 'suspension' },
  { keywords: ['svećic', 'svecic', 'paljenje', 'bobina', 'alternator', 'starter'], hint: 'electrical' },
  { keywords: ['kvačilo', 'kvacilo', 'zamajac', 'potisni'], hint: 'clutch' },
  { keywords: ['pumpa vode', 'termostat', 'hladnjak', 'rashladn'], hint: 'cooling' },
  { keywords: ['kaišni', 'kaish', 'razvodni'], hint: 'timing' },
  { keywords: ['karoserija', 'vrata', 'hauba', 'blatobran', 'branik'], hint: 'body' },
  { keywords: ['menjač', 'menjac'], hint: 'transmission' },
];

function guessCategoryHint(text: string): string {
  const lower = text.toLowerCase();
  for (const cat of CATEGORY_KEYWORDS) {
    if (cat.keywords.some(k => lower.includes(k))) return cat.hint;
  }
  return '';
}

function extractBrandFromText(text: string): string {
  for (const brand of KNOWN_BRANDS) {
    if (new RegExp(`\\b${brand}\\b`, 'i').test(text)) return brand;
  }
  return '';
}

/**
 * Parse prodajadelova.rs product listing HTML.
 * Attempts multiple strategies in order of reliability.
 */
function parseProductsFromHTML(
  html: string,
  categoryHint: string,
  baseUrl: string,
  supplierId: string
): ScrapedPartWithSignal[] {
  const parts: ScrapedPartWithSignal[] = [];
  const now = new Date().toISOString();
  const seenKeys = new Set<string>();

  // --- Strategy 1: JSON-LD ---
  const jsonLdRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ldMatch: RegExpExecArray | null;
  while ((ldMatch = jsonLdRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(ldMatch[1]);
      const items = Array.isArray(data) ? data :
                    data['@type'] === 'ItemList' ? (data.itemListElement || []).map((i: any) => i.item || i) :
                    data['@type'] === 'Product' ? [data] : [];

      for (const p of items) {
        if (p['@type'] !== 'Product') continue;
        const name = p.name || '';
        const offer = Array.isArray(p.offers) ? p.offers[0] : p.offers;
        const price = offer?.price || '';
        if (!name || !price) continue;

        const key = `${name}-${price}`;
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);

        const url = offer?.url || p.url || '';
        const image = Array.isArray(p.image) ? p.image[0] : (p.image || '');

        const availability: string = offer?.availability || '';
        const isInStock = availability.includes('InStock');
        const isOOS = availability.includes('OutOfStock') || availability.includes('Discontinued');
        const strength: StockSignalStrength = isOOS ? 'negative' : isInStock ? 'strong' : 'weak';
        parts.push({
          raw_name: name,
          raw_price: `${price} ${offer?.priceCurrency || 'RSD'}`,
          part_number: p.sku || p.mpn || '',
          oem_number: p.gtin || p.gtin13 || '',
          brand: (typeof p.brand === 'string' ? p.brand : p.brand?.name) || extractBrandFromText(name),
          category_hint: categoryHint || guessCategoryHint(name + ' ' + (p.description || '')),
          description: p.description || '',
          image_urls: image ? [image] : [],
          product_url: url.startsWith('http') ? url : (url ? `${baseUrl}${url}` : ''),
          stock: isInStock ? '10' : '0',
          supplier_id: supplierId,
          scraped_at: now,
          stock_signal_strength: strength,
          stock_signal_raw: String(availability || '').slice(0, 200),
          last_check_status: 'ok',
        });
      }
    } catch { /* ignore */ }
  }
  if (parts.length > 0) return parts;

  // --- Strategy 2: Embedded JSON in window.__INITIAL_STATE__ or similar ---
  const jsDataRe = /(?:window\.__(?:INITIAL_STATE|DATA|STORE|NUXT)__|var\s+initialData)\s*=\s*(\{[\s\S]{100,}?\});/gi;
  let jsMatch: RegExpExecArray | null;
  while ((jsMatch = jsDataRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(jsMatch[1]);
      // Try to find product arrays at various depths
      const productArrays = findProductArrays(data);
      for (const product of productArrays) {
        const name = product.name || product.naziv || product.title || '';
        const price = product.price || product.cena || product.cijena || '';
        if (!name || !price) continue;
        const key = `${name}-${price}`;
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);
        const qty = Number(product.stock ?? product.qty ?? product.quantity ?? 0);
        const strength: StockSignalStrength = qty > 0 ? 'strong' : qty === 0 ? 'negative' : 'weak';
        parts.push({
          raw_name: name,
          raw_price: `${price} RSD`,
          part_number: product.sku || product.partNumber || product.model_number || '',
          brand: product.brand || product.manufacturer || extractBrandFromText(name),
          category_hint: categoryHint || guessCategoryHint(name),
          description: product.description || '',
          image_urls: extractImageUrls(product),
          product_url: product.url || product.slug ? `${baseUrl}/${product.slug}` : '',
          stock: String(qty || '1'),
          supplier_id: supplierId,
          scraped_at: now,
          stock_signal_strength: strength,
          stock_signal_raw: `quantity=${qty}`,
          last_check_status: 'ok',
        });
      }
    } catch { /* ignore */ }
  }
  if (parts.length > 0) return parts;

  // --- Strategy 3: Generic product card parsing ---
  // Try to find product cards by looking for price+link co-occurrence
  const CARD_RE = /(<(?:div|article|li)[^>]+class=["'][^"']*(?:product|item|card|listing|rezultat)[^"']*["'][^>]*>)([\s\S]{50,3000}?)(?=<(?:div|article|li)[^>]+class=["'][^"']*(?:product|item|card|listing|rezultat)|\s*<\/(?:div|ul|section)>)/gi;
  let cardMatch: RegExpExecArray | null;
  while ((cardMatch = CARD_RE.exec(html)) !== null) {
    const block = cardMatch[0];

    const urlMatch = block.match(/href=["']([^"']+)["']/i);
    if (!urlMatch) continue;
    const rawUrl = urlMatch[1];
    const productUrl = rawUrl.startsWith('http') ? rawUrl : `${baseUrl}${rawUrl}`;

    const key = productUrl;
    if (seenKeys.has(key)) continue;

    const priceMatch = block.match(/(\d[\d.,\s]{2,})\s*(?:RSD|din|€|EUR)/i);
    if (!priceMatch) continue;

    const nameMatch = block.match(/<(?:h[1-6]|a)[^>]*>([^<]{5,200})<\/(?:h[1-6]|a)>/i);
    if (!nameMatch) continue;

    const rawName = nameMatch[1].trim();
    const imgMatch = block.match(/<img[^>]+(?:src|data-src)=["']([^"']+)["']/i);

    seenKeys.add(key);
    const negative = PD_NEGATIVE_RE.test(block);
    const strong = !negative && PD_STRONG_POS_RE.test(block);
    const strength: StockSignalStrength = negative ? 'negative' : strong ? 'strong' : 'weak';
    const rawSignal = (block.match(PD_STRONG_POS_RE) || block.match(PD_NEGATIVE_RE) || [''])[0];
    parts.push({
      raw_name: rawName,
      raw_price: priceMatch[0].trim(),
      brand: extractBrandFromText(rawName),
      category_hint: categoryHint || guessCategoryHint(rawName),
      description: '',
      image_urls: imgMatch ? [imgMatch[1].startsWith('http') ? imgMatch[1] : `${baseUrl}${imgMatch[1]}`] : [],
      product_url: productUrl,
      stock: negative ? '0' : strong ? '10' : '5',
      supplier_id: supplierId,
      scraped_at: now,
      stock_signal_strength: strength,
      stock_signal_raw: rawSignal.slice(0, 200),
      last_check_status: 'ok',
    });
  }

  return parts;
}

/** Recursively find arrays that look like product listings */
function findProductArrays(obj: any, depth = 0): any[] {
  if (depth > 5) return [];
  if (Array.isArray(obj) && obj.length > 0) {
    const first = obj[0];
    if (first && typeof first === 'object' && (first.name || first.naziv || first.title) && (first.price || first.cena)) {
      return obj;
    }
  }
  if (obj && typeof obj === 'object') {
    for (const val of Object.values(obj)) {
      const found = findProductArrays(val, depth + 1);
      if (found.length > 0) return found;
    }
  }
  return [];
}

function extractImageUrls(product: any): string[] {
  if (product.images && Array.isArray(product.images)) {
    return product.images.map((img: any) => (typeof img === 'string' ? img : img.url || img.src || '')).filter(Boolean);
  }
  if (product.image) return [typeof product.image === 'string' ? product.image : product.image.url || ''];
  if (product.thumbnail) return [product.thumbnail];
  return [];
}

// ─── Scraper Class ────────────────────────────────────────────────────────────

export class ProdajaDelovaScraper extends BaseScraper {
  private baseUrl = 'https://www.prodajadelova.rs';

  constructor(supplierId: string, supplierName = 'ProdajaDelova.rs') {
    super(supplierId, supplierName, CONFIG);
  }

  async fetchParts(maxPages = 5): Promise<ScrapedPartWithSignal[]> {
    const allParts: ScrapedPartWithSignal[] = [];
    const seenKeys = new Set<string>();

    for (const category of CATEGORY_PATHS) {
      this.log(`Scraping: ${category.label}`);
      const catParts = await this.scrapeCategory(category, maxPages);

      for (const part of catParts) {
        const key = part.product_url || `${part.raw_name}-${part.raw_price}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          allParts.push(part);
        }
      }

      await this.delay();
    }

    this.totalFetched = allParts.length;
    this.log(`Total: ${allParts.length} parts`);
    return allParts;
  }

  private async scrapeCategory(
    category: { path: string; hint: string; label: string },
    maxPages: number
  ): Promise<ScrapedPartWithSignal[]> {
    const parts: ScrapedPartWithSignal[] = [];

    for (let page = 1; page <= maxPages; page++) {
      const url = page === 1
        ? `${this.baseUrl}${category.path}`
        : `${this.baseUrl}${category.path}?page=${page}`;

      try {
        this.log(`  Page ${page}: ${url}`);
        const html = await fetchHTML(url);
        const pageParts = parseProductsFromHTML(html, category.hint, this.baseUrl, this.supplierId);
        this.log(`  Found ${pageParts.length} parts`);

        if (pageParts.length === 0) break;
        parts.push(...pageParts);

        // Check pagination
        if (!html.includes(`page=${page + 1}`) && !html.includes('rel="next"') && !html.includes('›') && !html.includes('Next')) {
          if (page > 1) break;
        }

        await this.delay();
      } catch (err: any) {
        this.logError(`${category.path} page ${page}: ${err.message}`);
        break;
      }
    }

    return parts;
  }
}

export default ProdajaDelovaScraper;
