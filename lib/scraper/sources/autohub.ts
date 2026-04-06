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

const CONFIG: ScrapeConfig = {
  type: 'html',
  base_url: 'https://www.autohub.rs',
  rate_limit_ms: 1500,
  pagination: { type: 'page_number', param: 'page', max_pages: 20 },
};
/p): string[] {
  const results: string[] = [];
  const re = new RegExp(`<${tag}[^>]+${attr}=["']([^"']+)["']`, 'gi');
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) results.push(m[1]);
  return results;
}

/** Extract text content inside a tag (first match) */
function extractText(html: string, selector: string): string {
  const re = new RegExp(`<${selector}[^>]*>([^<]{1,1000})</${selector}>`, 'i');
  const m = html.match(re);
  return m ? m[1].trim() : '';
}
/** Strip all HTML tags from a string */
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Extract href links from HTML that match a path pattern */
function extractLinks(html: string, pathPattern: RegEx