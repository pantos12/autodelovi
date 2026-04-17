/**
 * Alvadi.com Scraper (Baltic / EU parts catalogue)
 * Targets: https://www.alvadi.com — serves Serbia/EU buyers.
 *
 * Stock signal rules:
 *   strong   -> PDP shows a numeric stock count (e.g. "5 pcs in stock")
 *   weak     -> listing loads but no numeric stock count visible
 *   negative -> explicit out-of-stock text ("Not in stock", "Out of stock")
 *
 * NOTE: selectors are best-effort; verify post-deploy.
 */

import { BaseScraper, fetchHTML } from '../base';
import type { ScrapeConfig } from '../../types';
import type { ScrapedPartWithSignal, StockSignalStrength } from './autohub';

const CONFIG: ScrapeConfig = {
  type: 'html',
  base_url: 'https://www.alvadi.com',
  rate_limit_ms: 2000,
  pagination: { type: 'page_number', param: 'page', max_pages: 10 },
  headers: { 'Accept-Language': 'en-US,en;q=0.9' },
};

const CATEGORY_SEEDS: Array<{ path: string; hint: string; label: string }> = [
  { path: '/en/car-parts/filters',             hint: 'filters',    label: 'Filters' },
  { path: '/en/car-parts/braking-system',      hint: 'brakes',     label: 'Brakes' },
  { path: '/en/car-parts/suspension-steering', hint: 'suspension', label: 'Suspension' },
  { path: '/en/car-parts/ignition-glowplug',   hint: 'ignition',   label: 'Ignition' },
  { path: '/en/car-parts/cooling-system',      hint: 'cooling',    label: 'Cooling' },
  { path: '/en/car-parts/belt-drive',          hint: 'timing',     label: 'Belt drive' },
];

const STOCK_COUNT_RE = /(\d{1,4})\s*(?:pcs|kom|in\s*stock|na\s*stanju|available)/i;
const NEGATIVE_RE = /not\s*in\s*stock|out\s*of\s*stock|sold\s*out|nema\s*na\s*stanju|rasprodato|discontinued/i;

function classifyBlock(block: string): { strength: StockSignalStrength; raw: string } {
  if (NEGATIVE_RE.test(block)) {
    const m = block.match(NEGATIVE_RE);
    return { strength: 'negative', raw: (m?.[0] || '').slice(0, 200) };
  }
  const countMatch = block.match(STOCK_COUNT_RE);
  if (countMatch) {
    const n = parseInt(countMatch[1], 10);
    if (n > 0) return { strength: 'strong', raw: countMatch[0].slice(0, 200) };
    return { strength: 'negative', raw: countMatch[0].slice(0, 200) };
  }
  return { strength: 'weak', raw: '' };
}

function parseListing(html: string, baseUrl: string, categoryHint: string, supplierId: string): ScrapedPartWithSignal[] {
  const out: ScrapedPartWithSignal[] = [];
  const now = new Date().toISOString();
  const seen = new Set<string>();

  // JSON-LD
  const ldRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = ldRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(m[1]);
      const items =
        Array.isArray(data) ? data :
        data['@type'] === 'ItemList' ? (data.itemListElement || []).map((i: any) => i.item || i) :
        data['@type'] === 'Product' ? [data] : [];
      for (const p of items) {
        if (p['@type'] !== 'Product') continue;
        const name = p.name || '';
        const offer = Array.isArray(p.offers) ? p.offers[0] : p.offers;
        const price = offer?.price || '';
        if (!name || !price) continue;

        const url = offer?.url || p.url || '';
        const key = `${name}-${price}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const image = Array.isArray(p.image) ? p.image[0] : (p.image || '');
        const availability: string = offer?.availability || '';
        const inventoryLevel = Number(offer?.inventoryLevel?.value || offer?.inventoryLevel || 0);
        const isOOS = availability.includes('OutOfStock') || availability.includes('Discontinued');
        const strength: StockSignalStrength =
          isOOS ? 'negative' :
          inventoryLevel > 0 ? 'strong' :
          availability.includes('InStock') ? 'strong' :
          'weak';

        out.push({
          raw_name: name,
          raw_price: `${price} ${offer?.priceCurrency || 'EUR'}`,
          part_number: p.sku || p.mpn || '',
          oem_number: p.gtin || '',
          brand: (typeof p.brand === 'string' ? p.brand : p.brand?.name) || '',
          category_hint: categoryHint,
          description: p.description || '',
          image_urls: image ? [image] : [],
          product_url: url.startsWith('http') ? url : (url ? `${baseUrl}${url}` : ''),
          stock: inventoryLevel > 0 ? String(inventoryLevel) : (availability.includes('InStock') ? '1' : '0'),
          supplier_id: supplierId,
          scraped_at: now,
          stock_signal_strength: strength,
          stock_signal_raw: inventoryLevel > 0 ? `${inventoryLevel} pcs` : String(availability || '').slice(0, 200),
          last_check_status: 'ok',
        });
      }
    } catch { /* ignore */ }
  }
  if (out.length > 0) return out;

  // Card-based fallback
  const cardRe = /(<(?:div|article|li)[^>]+class=["'][^"']*(?:product|item|card|result)[^"']*["'][^>]*>)([\s\S]{60,3000}?)(?=<(?:div|article|li)[^>]+class=["'][^"']*(?:product|item|card|result)|\s*<\/(?:div|ul|section)>)/gi;
  let cm: RegExpExecArray | null;
  while ((cm = cardRe.exec(html)) !== null) {
    const block = cm[0];
    const urlMatch = block.match(/href=["']([^"']+)["']/i);
    if (!urlMatch) continue;
    const productUrl = urlMatch[1].startsWith('http') ? urlMatch[1] : `${baseUrl}${urlMatch[1]}`;
    if (seen.has(productUrl)) continue;

    const priceMatch = block.match(/(\d[\d.,\s]{2,})\s*(?:€|EUR|RSD|din)/i);
    if (!priceMatch) continue;
    const nameMatch = block.match(/<(?:h[1-6]|a)[^>]*>([^<]{5,200})<\/(?:h[1-6]|a)>/i);
    if (!nameMatch) continue;

    seen.add(productUrl);
    const imgMatch = block.match(/<img[^>]+(?:src|data-src)=["']([^"']+)["']/i);
    const signal = classifyBlock(block);

    out.push({
      raw_name: nameMatch[1].trim(),
      raw_price: priceMatch[0].trim(),
      category_hint: categoryHint,
      description: '',
      image_urls: imgMatch ? [imgMatch[1].startsWith('http') ? imgMatch[1] : `${baseUrl}${imgMatch[1]}`] : [],
      product_url: productUrl,
      stock: signal.strength === 'negative' ? '0' : signal.strength === 'strong' ? '10' : '1',
      supplier_id: supplierId,
      scraped_at: now,
      stock_signal_strength: signal.strength,
      stock_signal_raw: signal.raw,
      last_check_status: 'ok',
    });
  }

  return out;
}

export class AlvadiScraper extends BaseScraper {
  private baseUrl = 'https://www.alvadi.com';

  constructor(supplierId = 'alvadi', supplierName = 'Alvadi.com') {
    super(supplierId, supplierName, CONFIG);
  }

  async fetchParts(maxPages = 5): Promise<ScrapedPartWithSignal[]> {
    const out: ScrapedPartWithSignal[] = [];
    const seen = new Set<string>();

    for (const cat of CATEGORY_SEEDS) {
      this.log(`Scraping ${cat.label}`);
      for (let page = 1; page <= maxPages; page++) {
        const url = page === 1
          ? `${this.baseUrl}${cat.path}`
          : `${this.baseUrl}${cat.path}?page=${page}`;
        try {
          this.log(`  ${url}`);
          const html = await fetchHTML(url, this.config.headers);
          const parts = parseListing(html, this.baseUrl, cat.hint, this.supplierId);
          if (parts.length === 0) break;
          for (const p of parts) {
            const key = p.product_url || `${p.raw_name}-${p.raw_price}`;
            if (!seen.has(key)) {
              seen.add(key);
              out.push(p);
            }
          }
          await this.delay();
        } catch (e: any) {
          this.logError(`${cat.path} page ${page}: ${e.message}`);
          break;
        }
      }
    }

    this.totalFetched = out.length;
    this.log(`Total: ${out.length}`);
    return out;
  }
}

export default AlvadiScraper;
