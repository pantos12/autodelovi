import type { ScrapedPart, ScrapeConfig } from '../types';

export abstract class BaseScraper {
  protected config: ScrapeConfig;
  protected supplierId: string;
  protected supplierName: string;
  protected errors: string[] = [];
  protected totalFetched = 0;

  constructor(supplierId: string, supplierName: string, config: ScrapeConfig) {
    this.supplierId = supplierId;
    this.supplierName = supplierName;
    this.config = config;
  }

  abstract fetchParts(maxPages?: number): Promise<ScrapedPart[]>;

  getErrors(): string[] { return this.errors; }
  getTotalFetched(): number { return this.totalFetched; }

  protected log(msg: string) { console.log(`[${this.supplierName}] ${msg}`); }
  protected logError(msg: string) {
    const f = `[${this.supplierName}] ERROR: ${msg}`;
    console.error(f); this.errors.push(f);
  }
  protected async delay(ms?: number): Promise<void> {
    await new Promise(r => setTimeout(r, ms ?? this.config.rate_limit_ms ?? 1000));
  }
  protected now(): string { return new Date().toISOString(); }
}

export async function fetchHTML(url: string, headers?: Record<string, string>): Promise<string> {
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; AutoDeloviBot/1.0; +https://autodelovi.sale/bot)',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'sr-RS,sr;q=0.9,en;q=0.8',
      ...headers,
    },
    next: { revalidate: 0 },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} fetching ${url}`);
  return resp.text();
}

export async function fetchJSON<T>(url: string, headers?: Record<string, string>): Promise<T> {
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'AutoDeloviBot/1.0', 'Accept': 'application/json', ...headers },
    next: { revalidate: 0 },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} fetching ${url}`);
  return resp.json() as T;
}

export function extractPrice(raw: string): number {
  const cleaned = raw.replace(/[^\d,. ]/g, '').replace(/\s/g, '').replace(',', '.');
  const dotCount = (cleaned.match(/\./g) || []).length;
  if (dotCount > 1) return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0;
  return parseFloat(cleaned) || 0;
}

export function extractPartNumber(text: string): string {
  const patterns = [/\b([A-Z]{1,4}[-\s]?\d{4,10}[A-Z]?)\b/, /\b(\d{6,12})\b/, /OEM[:\s]+([A-Z0-9\-]+)/i];
  for (const p of patterns) { const m = text.match(p); if (m) return m[1].trim(); }
  return '';
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[čć]/g, 'c').replace(/[šš]/g, 's').replace(/[žž]/g, 'z').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
