import { BaseScraper, fetchHTML } from '../base';
import type { ScrapedPart, ScrapeConfig } from '../../types';

const CONFIG: ScrapeConfig = {
  type: 'html',
  base_url: 'https://www.autohub.rs',
  rate_limit_ms: 1500,
  pagination: { type: 'page_number', param: 'page', max_pages: 20 },
};

const AUTOHUB_CATEGORIES = [
  { slug: 'filteri',        hint: 'filters',      srLabel: 'Filteri' },
  { slug: 'kocnice',        hint: 'brakes',       srLabel: 'Kocnice' },
  { slug: 'amortizeri',     hint: 'suspension',   srLabel: 'Amortizeri' },
  { slug: 'svecice',        hint: 'ignition',     srLabel: 'Svecice' },
  { slug: 'elektrika',      hint: 'electrical',   srLabel: 'Elektrika' },
  { slug: 'kvacilo',        hint: 'clutch',       srLabel: 'Kvacilo' },
  { slug: 'hladjenje',      hint: 'cooling',      srLabel: 'Hladjenje' },
  { slug: 'distribucija',   hint: 'timing',       srLabel: 'Razvodni mehanizam' },
  { slug: 'ispusni-sistem', hint: 'exhaust',      srLabel: 'Ispusni sistem' },
  { slug: 'upravljanje',    hint: 'steering',     srLabel: 'Upravljanje' },
  { slug: 'menjac',         hint: 'transmission', srLabel: 'Menjac' },
  { slug: 'motor',          hint: 'engine',       srLabel: 'Motor' },
];

function parseAutoHubTitle(title) {
  const parts = title.split(/\s+-\s+/);
  if (parts.length >= 3) return { brand: parts[0].trim(), partNumber: parts[1].trim(), description: parts.slice(2).join(' - ').replace(/\s*\([^)]+\)\s*$/, '').trim() };
  if (parts.length === 2) return { brand: parts[0].trim(), partNumber: '', description: parts[1].trim() };
  return { brand: '', partNumber: '', description: title };
}

function parseProductsFromHTML(html, category, baseUrl, supplierId) {
  const parts = [];
  const now = new Date().toISOString();

  // Strategy 1: JSON-LD structured data
  const jsonLdRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ldMatch;
  while ((ldMatch = jsonLdRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(ldMatch[1]);
      if (data['@type'] === 'Product' && data.name && data.offers?.price) {
        const brand = typeof data.brand === 'string' ? data.brand : (data.brand?.name || '');
        parts.push({ raw_name: data.name, raw_price: `${data.offers.price} RSD`, part_number: data.sku || data.mpn || '', brand, category_hint: category.hint, description: data.description || '', image_urls: data.image ? [Array.isArray(data.image) ? data.image[0] : data.image] : [], product_url: (data.url || '').startsWith('http') ? data.url : `${baseUrl}${data.url || ''}`, stock: (data.offers?.availability || '').includes('InStock') ? '10' : '0', supplier_id: supplierId, scraped_at: now });
      }
      if (data['@type'] === 'ItemList' && Array.isArray(data.itemListElement)) {
        for (const item of data.itemListElement) {
          const p = item.item || item;
          if (p['@type'] === 'Product' && p.name && p.offers?.price) {
            parts.push({ raw_name: p.name, raw_price: `${p.offers.price} RSD`, part_number: p.sku || p.mpn || '', brand: p.brand?.name || p.brand || '', category_hint: category.hint, description: p.description || '', image_urls: p.image ? [Array.isArray(p.image) ? p.image[0] : p.image] : [], product_url: (p.url || '').startsWith('http') ? p.url : `${baseUrl}${p.url || ''}`, stock: (p.offers?.availability || '').includes('InStock') ? '10' : '0', supplier_id: supplierId, scraped_at: now });
          }
        }
      }
    } catch (e) {}
  }
  if (parts.length > 0) return parts;

  // Strategy 2: Product card regex
  const cardRe = /(<(?:article|div|li)[^>]+class=["'][^"']*(?:product|item|card)[^"']*["'][^>]*>)([\s\S]{100,2000}?)(?=<(?:article|div|li)[^>]+class=["'][^"']*(?:product|item|card)|\s*$)/gi;
  let cardMatch;
  const seen = new Set();
  while ((cardMatch = cardRe.exec(html)) !== null) {
    const block = cardMatch[0];
    const urlM = block.match(/href=["']([^"']*(?:\/p\/|\/product\/|\/deo\/)[^"']*)/i);
    if (!urlM) continue;
    const pUrl = urlM[1].startsWith('http') ? urlM[1] : `${baseUrl}${urlM[1]}`;
    if (seen.has(pUrl)) continue;
    const nameM = block.match(/<(?:h[1-6]|a)[^>]*>([^<]{5,150})<\/(?:h[1-6]|a)>/i);
    const priceM = block.match(/(\d[\d\s.,]{2,})\s*(?:RSD|din|EUR)/i);
    if (!nameM || !priceM) continue;
    const imgM = block.match(/<img[^>]+src=["']([^"']+)["']/i);
    const parsed = parseAutoHubTitle(nameM[1].trim());
    seen.add(pUrl);
    parts.push({ raw_name: nameM[1].trim(), raw_price: `${priceM[1].trim()} RSD`, part_number: parsed.partNumber, brand: parsed.brand, category_hint: category.hint, description: parsed.description, image_urls: imgM ? [imgM[1].startsWith('http') ? imgM[1] : `${baseUrl}${imgM[1]}`] : [], product_url: pUrl, stock: /na.stanju|in.stock/i.test(block) ? '10' : '1', supplier_id: supplierId, scraped_at: now });
  }
  return parts;
}

export class AutoHubScraper extends BaseScraper {
  constructor(supplierId, supplierName = 'AutoHub.rs') {
    super(supplierId, supplierName, CONFIG);
  }

  async fetchParts(maxPages = 5) {
    const allParts = [];
    const seen = new Set();
    for (const category of AUTOHUB_CATEGORIES) {
      this.log(`Scraping: ${category.srLabel}`);
      const catParts = await this.scrapeCategory(category, maxPages);
      for (const part of catParts) {
        const key = part.part_number || `${part.raw_name}-${part.raw_price}`;
        if (!seen.has(key)) { seen.add(key); allParts.push(part); }
      }
      await this.delay();
    }
    this.totalFetched = allParts.length;
    this.log(`Total: ${allParts.length} parts`);
    return allParts;
  }

  async scrapeCategory(category, maxPages) {
    const parts = [];
    for (let page = 1; page <= maxPages; page++) {
      const url = `https://www.autohub.rs/search/category/${category.slug}?q=&page=${page}`;
      try {
        this.log(`  Page ${page}: ${url}`);
        const html = await fetchHTML(url);
        const pageParts = parseProductsFromHTML(html, category, 'https://www.autohub.rs', this.supplierId);
        this.log(`  Found ${pageParts.length} parts`);
        if (pageParts.length === 0) break;
        parts.push(...pageParts);
        if (!html.includes(`page=${page + 1}`) && !html.includes('rel="next"') && page > 1) break;
        await this.delay();
      } catch (err) { this.logError(`${category.slug} p${page}: ${err.message}`); break; }
    }
    return parts;
  }
}

export default AutoHubScraper;
