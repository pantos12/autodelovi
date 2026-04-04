import { normalizeAll, setEurRate } from './normalizer';
import { DemoScraper } from './sources/demo';
import type { BaseScraper } from './base';
import type { PipelineResult, Supplier } from '../types';
import { upsertPart, recordPriceHistory, detectPriceChanges, createScrapingJob, updateScrapingJob } from '../supabase';

async function fetchEurRate(): Promise<number> {
  try {
    const resp = await fetch('https://api.exchangerate-api.com/v4/latest/EUR', { next: { revalidate: 3600 } });
    const data = await resp.json();
    return data?.rates?.RSD ?? 117.5;
  } catch { return 117.5; }
}

function getScraper(supplier: Supplier): BaseScraper {
  switch (supplier.id) {
    default:
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[Scraper] No scraper for ${supplier.id}, using demo`);
        return new DemoScraper(supplier.id, supplier.name);
      }
      throw new Error(`No scraper configured for supplier: ${supplier.id}`);
  }
}

export async function runScrapingPipeline(supplier: Supplier, triggeredBy: 'cron' | 'manual' | 'api' = 'api', maxPages = 10): Promise<PipelineResult> {
  const startTotal = Date.now();
  const job = await createScrapingJob(supplier.id, triggeredBy);
  console.log(`[Pipeline] Starting: ${supplier.name} | Job: ${job.id}`);

  const eurRate = await fetchEurRate();
  setEurRate(eurRate);

  await updateScrapingJob(job.id, { status: 'running' });
  const scraper = getScraper(supplier);
  const scrapeStart = Date.now();
  let rawParts: any[] = [];

  try {
    rawParts = await scraper.fetchParts(maxPages);
  } catch (err: any) {
    await updateScrapingJob(job.id, { status: 'failed', completed_at: new Date().toISOString(), errors: [err.message] });
    throw err;
  }

  const scrapeMs = Date.now() - scrapeStart;
  const normalizeStart = Date.now();
  const { normalized, rejected } = normalizeAll(rawParts);
  const normalizeMs = Date.now() - normalizeStart;

  const dbStart = Date.now();
  let upserted = 0, skipped = 0, priceChangeCount = 0;
  const dbErrors: string[] = [];

  const priceAlerts = await detectPriceChanges(normalized.map(p => ({ id: p.part_number, price: p.price, part_number: p.part_number, supplier_id: supplier.id })));
  priceChangeCount = priceAlerts.length;

  const BATCH = 20;
  for (let i = 0; i < normalized.length; i += BATCH) {
    await Promise.allSettled(normalized.slice(i, i + BATCH).map(async (norm) => {
      try {
        const saved = await upsertPart({
          part_number: norm.part_number, oem_number: norm.oem_number, name: norm.name,
          brand: norm.brand ?? '', category_id: norm.category_id ?? 'ostalo',
          description: norm.description, condition: norm.condition, status: 'active',
          images: norm.image_urls ?? [], specs: norm.specs, compatible_vehicles: norm.compatible_vehicles,
          supplier_id: supplier.id, price: norm.price, price_currency: 'RSD', price_eur: norm.price_eur,
          stock_quantity: parseInt(norm.stock ?? '0') || 0, source_url: norm.product_url,
          scraped_at: norm.scraped_at,
          slug: `${norm.part_number}-${norm.name}`.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,100),
        });
        await recordPriceHistory(saved.id, supplier.id, norm.price, norm.price_eur, 'RSD');
        upserted++;
      } catch (err: any) { dbErrors.push(`${norm.part_number}: ${err.message}`); skipped++; }
    }));
  }

  const dbMs = Date.now() - dbStart;
  const totalMs = Date.now() - startTotal;
  const allErrors = [...scraper.getErrors(), ...dbErrors];

  await updateScrapingJob(job.id, {
    status: allErrors.length > 0 && upserted === 0 ? 'failed' : 'completed',
    completed_at: new Date().toISOString(),
    parts_found: rawParts.length, parts_upserted: upserted, parts_skipped: skipped,
    errors: allErrors.slice(0, 50),
  });

  return {
    job_id: job.id, supplier_id: supplier.id,
    scrape_result: { parts_fetched: rawParts.length, duration_ms: scrapeMs, errors: scraper.getErrors() },
    normalize_result: { parts_normalized: normalized.length, parts_rejected: rejected.length, duration_ms: normalizeMs },
    db_result: { upserted, skipped, price_changes: priceChangeCount, duration_ms: dbMs },
    total_duration_ms: totalMs,
    status: allErrors.length > 0 && upserted === 0 ? 'failed' : 'completed',
  };
}

export async function runAllSuppliers(triggeredBy: 'cron' | 'manual' | 'api' = 'cron'): Promise<PipelineResult[]> {
  const { getSuppliers } = await import('../supabase');
  const suppliers = await getSuppliers(true);
  const results: PipelineResult[] = [];
  for (const supplier of suppliers) {
    try {
      results.push(await runScrapingPipeline(supplier, triggeredBy));
    } catch (err: any) {
      console.error(`[Pipeline] Failed for ${supplier.name}: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  return results;
}
