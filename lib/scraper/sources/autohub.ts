/**
 * AutoHub.rs Scraper
 * Targets: https://www.autohub.rs — Serbia's largest auto parts shop (700k+ products)
 * Owned by Infostud Group (same company as polovniautomobili.com)
 *
 * URL patterns discovered:
 *   Search by category: /search/category/{slug}?q=&page={n}
 *   Search by OEM:      /search/text/input?q={oem}&page={n}
 *   Product review:     /productreviews/{id}
 *
 * Product title format (from indexed page titles):
 *   "BRAND - PART_NUMBER - Name SR (Category SR)"
 *   e.g. "BOSCH - 1 987 531 013 - Osigurač (Univerzalni električni delovi)"
 */

import { BaseScraper, fetchHTML, extractPrice, slugify } from '../base';
import type { ScrapedPart, ScrapeConfig } from '../../types';

/**
 * Offer stock signal helpers shared across scrapers.
 * We attach these to ScrapedPart via a thin extension so the backfill
 * can pass them straight into the `offers` table.
 */
export type StockSignalStrength = 'strong' | 'weak' | 'negative';
export type LastCheckStatus = 'ok' | 'not_found' | 'blocked' | 'timeout';

export interface ScrapedPartWithSignal extends ScrapedPart {
  stock_signal_strength?: StockSignalStrength;
  stock_signal_raw?: string;
  last_check_status?: LastCheckStatus;
  merchant_id?: string;
  fitment?: {
    make: string;
    model?: string;
    year_from?: number;
    year_to?: number;
    engine?: string;
  }[];
}

const STRONG_POS_RE = /na\s*stanju|in\s*stock|dostupno|raspolo[zž]ivo/i;
const NEGATIVE_RE = /nema\s*na\s*stanju|rasprodato|po\s*porud[zž]bini|nedostupno|out\s*of\s*stock|prodato/i;

export function classifyStockSignal(raw: string): { strength: StockSignalStrength; raw: string } {
  const trimmed = (raw || '').slice(0, 200);
  if (NEGATIVE_RE.test(trimmed)) return { strength: 'negative', raw: trimmed };
  if (STRONG_POS_RE.test(trimmed)) return { strength: 'strong', raw: trimmed };
  return { strength: 'weak', raw: trimmed };
}

const CONFIG: ScrapeConfig = {
  type: 'html',
  base_url: 'https://www.autohub.rs',
  rate_limit_ms: 1500,
  pagination: { type: 'page_number', param: 'page', max_pages: 20 },
};

// Map autohub category slugs → our internal category hints
const AUTOHUB_CATEGORIES: Array<{ slug: string; hint: string; srLabel: string }> = [
  { slug: 'filteri',        hint: 'filters',      srLabel: 'Filteri' },
  { slug: 'kocnice',        hint: 'brakes',       srLabel: 'Kočnice' },
  { slug: 'amortizeri',     hint: 'suspension',   srLabel: 'Amortizeri' },
  { slug: 'svecice',        hint: 'ignition',     srLabel: 'Svećice' },
  { slug: 'elektrika',      hint: 'electrical',   srLabel: 'Elektrika' },
  { slug: 'kvacilo',        hint: 'clutch',       srLabel: 'Kvačilo' },
  { slug: 'hladjenje',      hint: 'cooling',      srLabel: 'Hlađenje' },
  { slug: 'distribucija',   hint: 'timing',       srLabel: 'Razvodni mehanizam' },
  { slug: 'ispusni-sistem', hint: 'exhaust',      srLabel: 'Ispušni sistem' },
  { slug: 'upravljanje',    hint: 'steering',     srLabel: 'Upravljanje' },
  { slug: 'menjac',         hint: 'transmission', srLabel: 'Menjač' },
  { slug: 'motor',          hint: 'engine',       srLabel: 'Motor' },
];

// ─── Mini HTML parser helpers ─────────────────────────────────────────────────

/** Extract all attribute values matching a pattern from HTML */
function extractAttr(html: string, tag: string, attr: string): string[] {
  const results: string[] = [];
  const re = new RegExp(`<${tag}[^>]+${attr}=["']([^"']+)["']`, 'gi');
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) results.push(m[1]);
  return results;
}

/** Extract text content inside a tag (first match) */
function extractText(html: string, selector: string): string {
  const re = new RegExp(`<${selector}[^>]*>([^<]+)</${selector}>`, 'i');
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

/** Strip all HTML tags from a string */
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Extract href links from HTML that match a path pattern */
function extractLinks(html: string, pathPattern: RegExp): string[] {
  const results: string[] = [];
  const re = /href=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    if (pathPattern.test(m[1])) results.push(m[1]);
  }
  return [...new Set(results)];
}

/**
 * Parse autohub.rs product listing HTML.
 * AutoHub uses Angular rendering but keeps product data in meta tags and
 * structured data for SEO — we rely on JSON-LD and meta og: tags.
 */
function parseProductsFromHTML(
  html: string,
  category: { slug: string; hint: string },
  baseUrl: string,
  supplierSupplierId: string
): ScrapedPartWithSignal[] {
  const parts: ScrapedPartWithSignal[] = [];
  const now = new Date().toISOString();

  // --- Strategy 1: JSON-LD structured data (most reliable) ---
  const jsonLdRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ldMatch: RegExpExecArray | null;
  while ((ldMatch = jsonLdRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(ldMatch[1]);
      // Product schema
      if (data['@type'] === 'Product') {
        const name = data.name || '';
        const brand = typeof data.brand === 'string' ? data.brand : data.brand?.name || '';
        const sku = data.sku || data.mpn || '';
        const price = data.offers?.price || data.offers?.[0]?.price || '';
        const image = Array.isArray(data.image) ? data.image[0] : data.image || '';
        const url = data.url || data.offers?.url || '';
        const desc = data.description || '';
        if (name && price) {
          const availability: string = data.offers?.availability || '';
          const rawAvail = availability || desc || name;
          const isInStock = availability.includes('InStock');
          const isOOS = availability.includes('OutOfStock') || availability.includes('Discontinued');
          const strength: StockSignalStrength = isOOS ? 'negative' : isInStock ? 'strong' : 'weak';
          parts.push({
            raw_name: name,
            raw_price: `${price} RSD`,
            part_number: sku,
            brand,
            category_hint: category.hint,
            description: desc,
            image_urls: image ? [image] : [],
            product_url: url.startsWith('http') ? url : `${baseUrl}${url}`,
            stock: isInStock ? '10' : '0',
            supplier_id: supplierSupplierId,
            scraped_at: now,
            stock_signal_strength: strength,
            stock_signal_raw: String(rawAvail).slice(0, 200),
            last_check_status: 'ok',
          });
        }
      }
      // ItemList schema
      if (data['@type'] === 'ItemList' && Array.isArray(data.itemListElement)) {
        for (const item of data.itemListElement) {
          const p = item.item || item;
          if (p['@type'] === 'Product' && p.name && p.offers?.price) {
            const availability: string = p.offers?.availability || '';
            const isInStock = availability.includes('InStock');
            const isOOS = availability.includes('OutOfStock') || availability.includes('Discontinued');
            const strength: StockSignalStrength = isOOS ? 'negative' : isInStock ? 'strong' : 'weak';
            parts.push({
              raw_name: p.name,
              raw_price: `${p.offers.price} RSD`,
              part_number: p.sku || p.mpn || '',
              brand: p.brand?.name || p.brand || '',
              category_hint: category.hint,
              description: p.description || '',
              image_urls: p.image ? [Array.isArray(p.image) ? p.image[0] : p.image] : [],
              product_url: p.url ? (p.url.startsWith('http') ? p.url : `${baseUrl}${p.url}`) : '',
              stock: isInStock ? '10' : '0',
              supplier_id: supplierSupplierId,
              scraped_at: now,
              stock_signal_strength: strength,
              stock_signal_raw: String(availability || p.name).slice(0, 200),
              last_check_status: 'ok',
            });
          }
        }
      }
    } catch { /* ignore malformed JSON-LD */ }
  }

  if (parts.length > 0) return parts;

  // --- Strategy 2: Product cards with common class patterns ---
  // AutoHub likely uses classes like: .product-item, .product-card, [data-product-id]
  // Try to find product blocks by looking for price+name co-occurrence

  // Find all anchors pointing to product pages
  const productLinkRe = /href=["']((\/p\/|\/product\/|\/produkt\/|\/deo\/|\/part\/)[^"']+)["']/gi;
  const productLinks = new Set<string>();
  let plMatch: RegExpExecArray | null;
  while ((plMatch = productLinkRe.exec(html)) !== null) {
    productLinks.add(plMatch[1]);
  }

  // Extract prices from common price containers
  const priceRe = /class=["'][^"']*(?:price|cena|cijena)[^"']*["'][^>]*>([^<]{3,30})</gi;
  const priceContainers: string[] = [];
  let prMatch: RegExpExecArray | null;
  while ((prMatch = priceRe.exec(html)) !== null) {
    const raw = prMatch[1].trim();
    if (/\d/.test(raw)) priceContainers.push(raw);
  }

  // Try to extract product cards from typical e-commerce HTML blocks
  // Look for elements containing both a product link and a price
  const cardRe = /(<(?:article|div|li)[^>]+class=["'][^"']*(?:product|item|card)[^"']*["'][^>]*>)([\s\S]{100,2000}?)(?=<(?:article|div|li)[^>]+class=["'][^"']*(?:product|item|card)|\s*$)/gi;
  let cardMatch: RegExpExecArray | null;
  const seenUrls = new Set<string>();

  while ((cardMatch = cardRe.exec(html)) !== null) {
    const block = cardMatch[0];

    // Extract product URL
    const urlMatch = block.match(/href=["']([^"']*(?:\/p\/|\/product\/|\/produkt\/|\/deo\/)[^"']*)/i);
    if (!urlMatch) continue;
    const productUrl = urlMatch[1].startsWith('http') ? urlMatch[1] : `${baseUrl}${urlMatch[1]}`;
    if (seenUrls.has(productUrl)) continue;
    seenUrls.add(productUrl);

    // Extract name
    const nameMatch = block.match(/<(?:h[1-6]|a)[^>]*>([^<]{5,150})<\/(?:h[1-6]|a)>/i);
    const rawName = nameMatch ? nameMatch[1].trim() : '';
    if (!rawName) continue;

    // Extract price
    const priceMatch = block.match(/(\d[\d\s.,]{2,})\s*(?:RSD|din|€|EUR)/i);
    if (!priceMatch) continue;

    // Extract image
    const imgMatch = block.match(/<img[^>]+src=["']([^"']+)["']/i);
    const imageUrl = imgMatch ? imgMatch[1] : '';

    // Extract stock signal
    const negative = NEGATIVE_RE.test(block);
    const strong = !negative && STRONG_POS_RE.test(block);
    const strength: StockSignalStrength = negative ? 'negative' : strong ? 'strong' : 'weak';
    const rawSignal = (block.match(STRONG_POS_RE) || block.match(NEGATIVE_RE) || [''])[0];

    // Parse autohub title format: "BRAND - PART_NUM - Name SR"
    const parsedParts = parseAutoHubTitle(rawName);

    parts.push({
      raw_name: rawName,
      raw_price: `${priceMatch[1].trim()} RSD`,
      part_number: parsedParts.partNumber,
      brand: parsedParts.brand,
      category_hint: category.hint,
      description: parsedParts.description,
      image_urls: imageUrl ? [imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`] : [],
      product_url: productUrl,
      stock: negative ? '0' : strong ? '10' : '1',
      supplier_id: supplierSupplierId,
      scraped_at: now,
      stock_signal_strength: strength,
      stock_signal_raw: rawSignal.slice(0, 200),
      last_check_status: 'ok',
    });
  }

  if (parts.length > 0) return parts;

  // --- Strategy 3: Parse meta tags for product info ---
  // Some pages embed product data as og:* meta tags
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1] || '';
  const ogPrice = html.match(/<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
                  html.match(/<meta[^>]+property=["']og:price:amount["'][^>]+content=["']([^"']+)["']/i)?.[1] || '';
  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] || '';
  const ogUrl = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i)?.[1] || '';

  if (ogTitle && ogPrice) {
    const parsed = parseAutoHubTitle(ogTitle);
    parts.push({
      raw_name: ogTitle,
      raw_price: `${ogPrice} RSD`,
      part_number: parsed.partNumber,
      brand: parsed.brand,
      category_hint: category.hint,
      description: parsed.description,
      image_urls: ogImage ? [ogImage] : [],
      product_url: ogUrl || baseUrl,
      stock: '5',
      supplier_id: supplierSupplierId,
      scraped_at: now,
      stock_signal_strength: 'weak',
      stock_signal_raw: '',
      last_check_status: 'ok',
    });
  }

  return parts;
}

/**
 * Parse autohub.rs title format: "BRAND - PART_NUMBER - Name SR (Category)"
 */
function parseAutoHubTitle(title: string): { brand: string; partNumber: string; description: string } {
  // Format: "BRAND - PART_NUM - Name (Category)"
  const parts = title.split(/\s+-\s+/);
  if (parts.length >= 3) {
    const brand = parts[0].trim();
    const partNumber = parts[1].trim();
    const desc = parts.slice(2).join(' - ').replace(/\s*\([^)]+\)\s*$/, '').trim();
    return { brand, partNumber, description: desc };
  }
  if (parts.length === 2) {
    return { brand: parts[0].trim(), partNumber: '', description: parts[1].trim() };
  }
  return { brand: '', partNumber: '', description: title };
}

// ─── Scraper Class ────────────────────────────────────────────────────────────

export class AutoHubScraper extends BaseScraper {
  private baseUrl = 'https://www.autohub.rs';

  constructor(supplierId: string, supplierName = 'AutoHub.rs') {
    super(supplierId, supplierName, CONFIG);
  }

  async fetchParts(maxPages = 5): Promise<ScrapedPartWithSignal[]> {
    const allParts: ScrapedPartWithSignal[] = [];
    const seenPartNumbers = new Set<string>();

    for (const category of AUTOHUB_CATEGORIES) {
      this.log(`Scraping category: ${category.srLabel}`);
      const categoryParts = await this.scrapeCategory(category, maxPages);

      for (const part of categoryParts) {
        const key = part.part_number || `${part.raw_name}-${part.raw_price}`;
        if (!seenPartNumbers.has(key)) {
          seenPartNumbers.add(key);
          allParts.push(part);
        }
      }

      await this.delay();
    }

    this.totalFetched = allParts.length;
    this.log(`Total fetched: ${allParts.length} parts`);
    return allParts;
  }

  private async scrapeCategory(
    category: { slug: string; hint: string; srLabel: string },
    maxPages: number
  ): Promise<ScrapedPartWithSignal[]> {
    const parts: ScrapedPartWithSignal[] = [];

    for (let page = 1; page <= maxPages; page++) {
      const url = `${this.baseUrl}/search/category/${category.slug}?q=&page=${page}`;
      try {
        this.log(`  Page ${page}: ${url}`);
        const html = await fetchHTML(url);

        const pageParts = parseProductsFromHTML(html, category, this.baseUrl, this.supplierId);
        this.log(`  Found ${pageParts.length} parts on page ${page}`);

        if (pageParts.length === 0) {
          // No results — either empty or need different URL format
          // Try alternate format
          const altUrl = `${this.baseUrl}/t/${category.slug}/${page}`;
          const altHtml = await fetchHTML(altUrl).catch(() => '');
          if (altHtml) {
            const altParts = parseProductsFromHTML(altHtml, category, this.baseUrl, this.supplierId);
            if (altParts.length > 0) {
              parts.push(...altParts);
              this.log(`  Alternate URL found ${altParts.length} parts`);
            } else {
              break; // No products on this page, stop pagination
            }
          } else {
            break;
          }
        } else {
          parts.push(...pageParts);
        }

        // Check if there's a next page
        if (!html.includes(`page=${page + 1}`) && !html.includes('rel="next"')) {
          if (page > 1) break; // Only break after at least page 1
        }

        await this.delay();
      } catch (err: any) {
        this.logError(`Category ${category.slug} page ${page}: ${err.message}`);
        break;
      }
    }

    return parts;
  }
}

export default AutoHubScraper;
