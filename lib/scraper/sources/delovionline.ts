/**
 * DeloviOnline.rs Scraper
 * Targets: https://www.delovionline.rs
 *
 * Strategy:
 *   - Search-by-vehicle and OE-number entry points
 *   - Category landing pages as seed URLs
 *   - Parse JSON-LD Product schema first, fall back to generic card parsing
 *
 * Stock signal rules:
 *   strong   -> element has class matching /(in-?stock|na-?stanju|badge-success|available)/
 *   weak     -> listing loads but no explicit stock marker
 *   negative -> "nema na stanju" / "rasprodato" / "po porudžbini"
 *
 * NOTE: selectors below are best-effort guesses; the real site may differ.
 * Verify post-deploy and tweak as needed.
 */

import { BaseScraper, fetchHTML } from '../base';
import type { ScrapeConfig } from '../../types';
import type { ScrapedPartWithSignal, StockSignalStrength } from './autohub';

const CONFIG: ScrapeConfig = {
  type: 'html',
  base_url: 'https://www.delovionline.rs',
  rate_limit_ms: 1800,
  pagination: { type: 'page_number', param: 'page', max_pages: 10 },
};

const CATEGORY_SEEDS: Array<{ path: string; hint: string; label: string }> = [
  { path: '/filteri',             hint: 'filters',      label: 'Filteri' },
  { path: '/kocioni-sistem',      hint: 'brakes',       label: 'Kočnice' },
  { path: '/amortizeri-i-opruge', hint: 'suspension',   label: 'Amortizeri' },
  { path: '/paljenje',            hint: 'ignition',     label: 'Paljenje' },
  { path: '/elektrika',           hint: 'electrical',   label: 'Elektrika' },
  { path: '/rashladni-sistem',    hint: 'cooling',      label: 'Hlađenje' },
  { path: '/kaisni-prenosi',      hint: 'timing',       label: 'Kaiševi' },
];

const STRONG_CLASS_RE = /class=["'][^"']*(?:in-?stock|na-?stanju|badge[-_]success|stock[-_]ok|dostupno|available)[^"']*["']/i;
const NEGATIVE_TEXT_RE = /nema\s*na\s*stanju|rasprodato|po\s*porud[zž]bini|nedostupno|out\s*of\s*stock/i;

function classifyBlock(block: string): { strength: StockSignalStrength; raw: string } {
  if (NEGATIVE_TEXT_RE.test(block)) {
    const m = block.match(NEGATIVE_TEXT_RE);
    return { strength: 'negative', raw: (m?.[0] || '').slice(0, 200) };
  }
  if (STRONG_CLASS_RE.test(block)) {
    const m = block.match(STRONG_CLASS_RE);
    return { strength: 'strong', raw: (m?.[0] || '').slice(0, 200) };
  }
  return { strength: 'weak', raw: '' };
}

function parseListing(html: string, baseUrl: string, categoryHint: string, supplierId: string): ScrapedPartWithSignal[] {
  const out: ScrapedPartWithSignal[] = [];
  const now = new Date().toISOString();
  const seen = new Set<string>();

  // JSON-LD first
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
        const isInStock = availability.includes('InStock');
        const isOOS = availability.includes('OutOfStock') || availability.includes('Discontinued');
        const strength: StockSignalStrength = isOOS ? 'negative' : isInStock ? 'strong' : 'weak';

        out.push({
          raw_name: name,
          raw_price: `${price} ${offer?.priceCurrency || 'RSD'}`,
          part_number: p.sku || p.mpn || '',
          oem_number: p.gtin || '',
          brand: (typeof p.brand === 'string' ? p.brand : p.brand?.name) || '',
          category_hint: categoryHint,
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
  if (out.length > 0) return out;

  // Generic card parsing
  const cardRe = /(<(?:div|article|li)[^>]+class=["'][^"']*(?:product|artikl|item|card)[^"']*["'][^>]*>)([\s\S]{60,3000}?)(?=<(?:div|article|li)[^>]+class=["'][^"']*(?:product|artikl|item|card)|\s*<\/(?:div|ul|section)>)/gi;
  let cm: RegExpExecArray | null;
  while ((cm = cardRe.exec(html)) !== null) {
    const block = cm[0];
    const urlMatch = block.match(/href=["']([^"']+)["']/i);
    if (!urlMatch) continue;
    const productUrl = urlMatch[1].startsWith('http') ? urlMatch[1] : `${baseUrl}${urlMatch[1]}`;
    if (seen.has(productUrl)) continue;

    const priceMatch = block.match(/(\d[\d.,\s]{2,})\s*(?:RSD|din|€|EUR)/i);
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

export class DeloviOnlineScraper extends BaseScraper {
  private baseUrl = 'https://www.delovionline.rs';

  constructor(supplierId = 'delovionline', supplierName = 'DeloviOnline.rs') {
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
          const html = await fetchHTML(url);
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

export default DeloviOnlineScraper;
