import { normalizeAll, setEurRate } from './normalizer';
import { DemoScraper } from './sources/demo';
import { AutoHubScraper } from './sources/autohub';
import { HaloOglasiScraper } from './sources/halooglasi';
import { ProdajaDelovaScraper } from './sources/prodajadelova';
import type { BaseScraper } from './base';
import type { Supplier, ScrapingJob } from '../types';
import { upsertPart, recordPriceHistory, detectPriceChanges, createScrapingJob, updateScrapingJob, getSuppliers } from '../supabase';

export function getScraper(supplier: Supplier): BaseScraper {
  const url = (supplier.website || supplier.scrape_url || '').toLowerCase();

  if (url.includes('autohub.rs')) return new AutoHubScraper(supplier.id, supplier.name);
  if (url.includes('halooglasi.com')) return new HaloOglasiScraper(supplier.id, supplier.name);
  if (url.includes('prodajadelova.rs')) return new ProdajaDelovaScraper(supplier.id, supplier.name);

  // Fallback to demo scraper
  return new DemoScraper();
}

export interface PipelineResult {
  supplier_id: string;
  status: 'success' | 'failed';
  scrape_result: {
    parts_fetched: number;
    parts_normalized: number;
    parts_rejected: number;
  };
  db_result: {
    upserted: number;
    skipped: number;
    price_changes: number;
  };
  duration_ms: number;
  error?: string;
}

export async function runScrapingPipeline(
  supplier: Supplier,
  triggeredBy: 'cron' | 'manual' | 'api' = 'api',
  maxPages = 10
): Promise<PipelineResult> {
  const startTime = Date.now();
  const job = await createScrapingJob(supplier.id, triggeredBy);

  try {
    const scraper = getScraper(supplier);
    const rawParts = await scraper.fetchParts(maxPages);
    const { normalized, rejected } = normalizeAll(rawParts);

    let upserted = 0;
    let skipped = 0;
    for (const part of normalized) {
      try {
        const partNum = part.part_number || part.raw_name;
        await upsertPart({
          part_number: partNum,
          name: part.name,
          name_sr: part.name,
          slug: partNum,
          description: part.description || '',
          price: part.price,
          price_eur: part.price_eur,
          currency: part.price_currency || 'RSD',
          supplier_id: supplier.id,
          image_url: part.image_urls?.[0],
          source_url: part.product_url,
          condition: part.condition || 'new',
          status: 'active',
          in_stock: true,
          oem_number: part.oem_number,
          brand: part.brand,
        });
        upserted++;
        if (part.price > 0) {
          await recordPriceHistory(partNum, supplier.id, part.price, part.price_eur || 0, part.price_currency || 'RSD');
        }
      } catch (e) {
        skipped++;
      }
    }

    const priceAlerts = await detectPriceChanges(
      normalized.map(p => ({ id: p.part_number || p.raw_name, price: p.price, part_number: p.part_number || p.raw_name, supplier_id: supplier.id }))
    );

    await updateScrapingJob(job.id, {
      status: 'completed', parts_found: rawParts.length, parts_upserted: upserted,
      parts_skipped: skipped + rejected.length, completed_at: new Date().toISOString(),
    });

    return {
      supplier_id: supplier.id, status: 'success',
      scrape_result: { parts_fetched: rawParts.length, parts_normalized: normalized.length, parts_rejected: rejected.length },
      db_result: { upserted, skipped: skipped + rejected.length, price_changes: priceAlerts.length },
      duration_ms: Date.now() - startTime,
    };
  } catch (err: any) {
    await updateScrapingJob(job.id, { status: 'failed', errors: [err.message], completed_at: new Date().toISOString() });
    return {
      supplier_id: supplier.id, status: 'failed',
      scrape_result: { parts_fetched: 0, parts_normalized: 0, parts_rejected: 0 },
      db_result: { upserted: 0, skipped: 0, price_changes: 0 },
      duration_ms: Date.now() - startTime, error: err.message,
    };
  }
}

export async function runAllSuppliers(triggeredBy: 'cron' | 'manual' | 'api' = 'api'): Promise<PipelineResult[]> {
  const suppliers = await getSuppliers(true);
  const results: PipelineResult[] = [];
  for (const supplier of suppliers) {
    const result = await runScrapingPipeline(supplier, triggeredBy);
    results.push(result);
  }
  return results;
}
