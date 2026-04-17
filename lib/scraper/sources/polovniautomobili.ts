/**
 * PolovniAutomobili.com — classifieds scraper
 * Section: https://www.polovniautomobili.com/auto-delovi
 *
 * This site is JS-heavy and aggressively detects bots, so we use
 * playwright-extra + puppeteer-extra-plugin-stealth for best results.
 *
 * Stock signal rules:
 *   strong   -> ad is live, not flagged "prodato"
 *   weak     -> ad loads but status is ambiguous
 *   negative -> "prodato" / "rezervisano" / page 404 / removed
 *
 * NOTE: classifieds are used-parts listings from private sellers.
 * Each listing is unique; we map it as supplier_id = 'polovniautomobili'.
 *
 * Deps (not yet installed — added to package.json, the orchestrator will run npm install):
 *   - playwright-extra
 *   - puppeteer-extra-plugin-stealth
 */

import { BaseScraper } from '../base';
import type { ScrapeConfig } from '../../types';
import type { ScrapedPartWithSignal, StockSignalStrength } from './autohub';

const CONFIG: ScrapeConfig = {
  type: 'html',
  base_url: 'https://www.polovniautomobili.com',
  rate_limit_ms: 3000,
  pagination: { type: 'page_number', param: 'page', max_pages: 8 },
};

const SECTIONS = [
  { path: '/auto-delovi', hint: '', label: 'Svi delovi' },
];

const SOLD_RE = /prodato|rezervisano|neaktivn|nije\s*dostupn/i;

export class PolovniAutomobiliScraper extends BaseScraper {
  private baseUrl = 'https://www.polovniautomobili.com';

  constructor(supplierId = 'polovniautomobili', supplierName = 'PolovniAutomobili.com') {
    super(supplierId, supplierName, CONFIG);
  }

  async fetchParts(maxPages = 5): Promise<ScrapedPartWithSignal[]> {
    // Lazy-load playwright-extra + stealth so the module can be imported
    // even in environments where they aren't installed yet.
    let chromium: any;
    let stealth: any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pw = require('playwright-extra');
      chromium = pw.chromium;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      stealth = require('puppeteer-extra-plugin-stealth')();
      chromium.use(stealth);
    } catch (e: any) {
      this.logError(`playwright-extra / stealth not available: ${e.message}`);
      return [];
    }

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
    }).catch((e: any) => {
      this.logError(`Failed to launch browser: ${e.message}`);
      return null;
    });

    if (!browser) return [];

    const out: ScrapedPartWithSignal[] = [];
    const seen = new Set<string>();

    try {
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        locale: 'sr-RS',
        viewport: { width: 1366, height: 900 },
      });
      const page = await context.newPage();

      for (const section of SECTIONS) {
        this.log(`Scraping ${section.label}`);
        for (let p = 1; p <= maxPages; p++) {
          const url = p === 1
            ? `${this.baseUrl}${section.path}`
            : `${this.baseUrl}${section.path}?page=${p}`;
          try {
            this.log(`  ${url}`);
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForTimeout(1500);

            // Extract listing cards via page.evaluate
            const listings: Array<{
              href: string;
              title: string;
              priceText: string;
              imgSrc: string;
              sold: boolean;
              rawText: string;
            }> = await page.evaluate(() => {
              // Listing cards on polovniautomobili use various class prefixes
              // Best guess selectors: article.classified, .uk-grid .uk-card, [data-ad-id]
              const rows = Array.from(
                document.querySelectorAll(
                  'article.classified, div[data-ad-id], .classified, .uk-card, li.classified-listing'
                )
              );
              return rows.map((el: Element) => {
                const a = el.querySelector('a[href*="/auto-delovi/"], a[href*="/oglas/"]') as HTMLAnchorElement | null;
                const href = a?.href || '';
                const titleEl = el.querySelector('h2, h3, .title, .ma-title') as HTMLElement | null;
                const priceEl = el.querySelector('.price, [class*="price"], .ma-price') as HTMLElement | null;
                const img = el.querySelector('img') as HTMLImageElement | null;
                const rawText = (el.textContent || '').slice(0, 500);
                const sold = /prodato|rezervisano/i.test(rawText);
                return {
                  href,
                  title: (titleEl?.textContent || '').trim(),
                  priceText: (priceEl?.textContent || '').trim(),
                  imgSrc: img?.src || img?.getAttribute('data-src') || '',
                  sold,
                  rawText,
                };
              }).filter((r) => r.href && r.title);
            }).catch((e: any) => {
              this.logError(`page.evaluate failed: ${e.message}`);
              return [];
            });

            if (listings.length === 0) {
              this.log(`  No listings on page ${p}`);
              break;
            }

            const now = new Date().toISOString();
            for (const lst of listings) {
              if (seen.has(lst.href)) continue;
              seen.add(lst.href);

              if (!lst.priceText) continue;

              const negative = lst.sold || SOLD_RE.test(lst.rawText);
              const strength: StockSignalStrength = negative ? 'negative' : 'strong';
              const rawSignal = negative
                ? (lst.rawText.match(SOLD_RE)?.[0] || 'prodato')
                : 'active listing';

              out.push({
                raw_name: lst.title,
                raw_price: lst.priceText,
                category_hint: section.hint,
                description: '',
                image_urls: lst.imgSrc ? [lst.imgSrc] : [],
                product_url: lst.href,
                stock: negative ? '0' : '1',
                supplier_id: this.supplierId,
                scraped_at: now,
                stock_signal_strength: strength,
                stock_signal_raw: rawSignal.slice(0, 200),
                last_check_status: 'ok',
              });
            }

            await this.delay();
          } catch (e: any) {
            this.logError(`${section.path} page ${p}: ${e.message}`);
            break;
          }
        }
      }
    } finally {
      await browser.close().catch(() => {});
    }

    this.totalFetched = out.length;
    this.log(`Total: ${out.length}`);
    return out;
  }
}

export default PolovniAutomobiliScraper;
