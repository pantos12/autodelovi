/**
 * scripts/backfill.ts
 *
 * One-time local backfill for the 5 v3.3 merchant sources.
 *
 * Usage:
 *   npx tsx scripts/backfill.ts
 *   npx tsx scripts/backfill.ts --source=autohub
 *   npx tsx scripts/backfill.ts --source=alvadi --limit=50
 *   npx tsx scripts/backfill.ts --dry-run
 *   npx tsx scripts/backfill.ts --since=2026-04-01T00:00:00Z
 *
 * Flags:
 *   --source=<name>   Only run one source. Repeatable: --source=a --source=b
 *   --limit=<n>       Cap parts per source (useful for smoke testing).
 *   --dry-run         Do not write to the DB; log intended writes.
 *   --since=<ISO>     Informational, recorded in backfill_runs.flags.
 *
 * Behaviour:
 *   1. Loads env from .env.local (via dotenv).
 *   2. Upserts the 5 new merchant IDs into `suppliers` so the
 *      parts_v2.supplier_id FK resolves.
 *   3. For each source:
 *        - inserts a backfill_runs row with status='running'
 *        - runs the scraper
 *        - normalizes
 *        - upserts parts_v2, offers (unique on part_id + merchant_id),
 *          fitment_claims
 *        - updates backfill_runs with counts + final status
 *   4. Exit 0 on full success, 1 on any per-source failure.
 *
 * Idempotent:
 *   - parts_v2 upsert conflict is on (part_number, supplier_id)
 *   - offers upsert conflict is on (part_id, merchant_id)
 *   - fitment_claims uses a dedup check before insert
 *   - suppliers upsert conflict is on id
 */

import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';

// Load env BEFORE importing any module that reads process.env
loadEnv({ path: resolve(process.cwd(), '.env.local') });

import { supabaseAdmin } from '../lib/supabase';
import { normalizeAll } from '../lib/scraper/normalizer';
import { getScraperByName, SOURCE_NAMES, type SourceName } from '../lib/scraper';
import type { ScrapedPartWithSignal } from '../lib/scraper/sources/autohub';

// ─── CLI parsing ──────────────────────────────────────────────────────────────

interface Args {
  sources: string[];
  limit?: number;
  dryRun: boolean;
  since?: string;
}

function parseArgs(argv: string[]): Args {
  const out: Args = { sources: [], dryRun: false };
  for (const a of argv.slice(2)) {
    if (a === '--dry-run') out.dryRun = true;
    else if (a.startsWith('--source=')) out.sources.push(a.slice('--source='.length));
    else if (a.startsWith('--limit=')) out.limit = parseInt(a.slice('--limit='.length), 10);
    else if (a.startsWith('--since=')) out.since = a.slice('--since='.length);
    else console.warn(`[backfill] unknown arg: ${a}`);
  }
  if (out.sources.length === 0) out.sources = [...SOURCE_NAMES];
  return out;
}

// ─── Supplier bootstrap ──────────────────────────────────────────────────────

const NEW_SUPPLIERS: Array<{ id: SourceName; slug: string; name: string }> = [
  { id: 'autohub',           slug: 'autohub',           name: 'AutoHub.rs' },
  { id: 'prodajadelova',     slug: 'prodajadelova',     name: 'ProdajaDelova.rs' },
  { id: 'delovionline',      slug: 'delovionline',      name: 'DeloviOnline.rs' },
  { id: 'alvadi',            slug: 'alvadi',            name: 'Alvadi.com' },
  { id: 'polovniautomobili', slug: 'polovniautomobili', name: 'PolovniAutomobili.com' },
];

async function ensureSuppliers(dryRun: boolean): Promise<void> {
  console.log('[backfill] Ensuring suppliers rows exist…');
  for (const s of NEW_SUPPLIERS) {
    const row = {
      id: s.id,
      slug: s.slug,
      name: s.name,
      city: 'Beograd',
      status: 'active' as const,
      is_verified: false,
    };
    if (dryRun) {
      console.log(`[backfill] [dry-run] would upsert supplier ${s.id}`);
      continue;
    }
    const { error } = await supabaseAdmin
      .from('suppliers')
      .upsert(row, { onConflict: 'id', ignoreDuplicates: true });
    if (error) {
      console.warn(`[backfill] supplier upsert warn (${s.id}): ${error.message}`);
    }
  }
}

// ─── Backfill run bookkeeping ────────────────────────────────────────────────

async function startRun(source: string, flags: Record<string, unknown>, dryRun: boolean): Promise<string | null> {
  if (dryRun) return null;
  const { data, error } = await supabaseAdmin
    .from('backfill_runs')
    .insert({
      source,
      started_at: new Date().toISOString(),
      status: 'running',
      parts_found: 0,
      parts_upserted: 0,
      parts_skipped: 0,
      errors: [],
      checkpoint: {},
      flags,
    })
    .select('id')
    .single();
  if (error) {
    console.warn(`[backfill] failed to create backfill_runs row for ${source}: ${error.message}`);
    return null;
  }
  return data.id as string;
}

async function finishRun(
  runId: string | null,
  status: 'success' | 'failed' | 'partial',
  counts: { parts_found: number; parts_upserted: number; parts_skipped: number },
  errors: string[],
): Promise<void> {
  if (!runId) return;
  const { error } = await supabaseAdmin
    .from('backfill_runs')
    .update({
      finished_at: new Date().toISOString(),
      status,
      parts_found: counts.parts_found,
      parts_upserted: counts.parts_upserted,
      parts_skipped: counts.parts_skipped,
      errors,
    })
    .eq('id', runId);
  if (error) {
    console.warn(`[backfill] failed to finalize backfill_runs row ${runId}: ${error.message}`);
  }
}

// ─── Write helpers ───────────────────────────────────────────────────────────

function partSlug(partNumber: string, supplierId: string): string {
  return `${supplierId}-${partNumber}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function upsertPartRow(
  raw: ScrapedPartWithSignal,
  normalized: {
    name: string;
    price: number;
    price_eur: number;
    price_currency: string;
    category_id?: string;
    condition: string;
    specs: Record<string, string>;
    compatible_vehicles: any[];
  },
  supplierId: string,
  dryRun: boolean,
): Promise<string | null> {
  const partNumber = raw.part_number || normalized.name.slice(0, 40);
  const row = {
    part_number: partNumber,
    supplier_id: supplierId,
    name: normalized.name,
    name_sr: normalized.name,
    slug: partSlug(partNumber, supplierId),
    description: raw.description || '',
    price: normalized.price,
    price_eur: normalized.price_eur,
    price_currency: normalized.price_currency,
    images: raw.image_urls && raw.image_urls.length ? [raw.image_urls[0]] : [],
    source_url: raw.product_url || null,
    condition: normalized.condition,
    status: 'active',
    stock_quantity: Number(raw.stock) || 0,
    oem_number: raw.oem_number || null,
    brand: raw.brand || '',
    category_id: normalized.category_id || 'ostalo',
    specs: normalized.specs || {},
    compatible_vehicles: normalized.compatible_vehicles || [],
  };

  if (dryRun) {
    console.log(`[backfill] [dry-run] would upsert part ${partNumber} for ${supplierId}`);
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from('parts_v2')
    .upsert(row, { onConflict: 'part_number,supplier_id', ignoreDuplicates: false })
    .select('id')
    .single();
  if (error) throw new Error(`parts_v2 upsert: ${error.message}`);
  return data.id as string;
}

async function upsertOfferRow(
  partId: string,
  merchantId: string,
  raw: ScrapedPartWithSignal,
  normalized: { price: number; price_eur: number; price_currency: string },
  dryRun: boolean,
): Promise<void> {
  const row = {
    part_id: partId,
    merchant_id: merchantId,
    source_url: raw.product_url || null,
    price: normalized.price,
    price_currency: normalized.price_currency,
    price_eur: normalized.price_eur,
    stock_signal_strength: raw.stock_signal_strength || 'weak',
    stock_signal_raw: raw.stock_signal_raw || null,
    last_check_status: raw.last_check_status || 'ok',
    last_seen_at: new Date().toISOString(),
  };

  if (dryRun) {
    console.log(`[backfill] [dry-run] would upsert offer part=${partId} merchant=${merchantId}`);
    return;
  }

  const { error } = await supabaseAdmin
    .from('offers')
    .upsert(row, { onConflict: 'part_id,merchant_id', ignoreDuplicates: false });
  if (error) throw new Error(`offers upsert: ${error.message}`);
}

async function insertFitmentClaims(
  partId: string,
  vehicles: any[],
  source: string,
  dryRun: boolean,
): Promise<void> {
  if (!vehicles || vehicles.length === 0) return;
  for (const v of vehicles) {
    const row = {
      part_id: partId,
      make: v.make || '',
      model: v.model || null,
      year_from: v.year_from || null,
      year_to: v.year_to || null,
      engine: v.engine || null,
      source,
      confidence: 0.5,
    };
    if (!row.make) continue;

    if (dryRun) {
      console.log(`[backfill] [dry-run] would insert fitment ${row.make}/${row.model} for part ${partId}`);
      continue;
    }

    // Dedup: check existing row with same (part_id, make, model, year_from)
    const { data: existing } = await supabaseAdmin
      .from('fitment_claims')
      .select('id')
      .eq('part_id', partId)
      .eq('make', row.make)
      .eq('model', row.model || '')
      .eq('year_from', row.year_from || 0)
      .limit(1);
    if (existing && existing.length > 0) continue;

    const { error } = await supabaseAdmin.from('fitment_claims').insert(row);
    if (error) {
      // Non-fatal: log and continue
      console.warn(`[backfill] fitment insert warn: ${error.message}`);
    }
  }
}

// ─── Per-source pipeline ─────────────────────────────────────────────────────

async function runSource(
  source: string,
  args: Args,
): Promise<{ source: string; ok: boolean; counts: { parts_found: number; parts_upserted: number; parts_skipped: number }; errors: string[] }> {
  console.log(`\n[backfill] === source: ${source} ===`);
  const flags: Record<string, unknown> = { limit: args.limit ?? null, since: args.since ?? null, dry_run: args.dryRun };
  const runId = await startRun(source, flags, args.dryRun);

  const errors: string[] = [];
  let found = 0;
  let upserted = 0;
  let skipped = 0;

  try {
    const scraper = getScraperByName(source);
    const raws = (await scraper.fetchParts()) as ScrapedPartWithSignal[];
    const limited = args.limit ? raws.slice(0, args.limit) : raws;
    found = limited.length;
    console.log(`[backfill] ${source}: ${found} raw parts`);

    const { normalized, rejected } = normalizeAll(limited);
    skipped += rejected.length;
    console.log(`[backfill] ${source}: normalized=${normalized.length} rejected=${rejected.length}`);

    for (let i = 0; i < normalized.length; i++) {
      const n = normalized[i];
      const raw = limited[i] as ScrapedPartWithSignal;
      try {
        const partId = await upsertPartRow(
          raw,
          {
            name: n.name,
            price: n.price,
            price_eur: n.price_eur,
            price_currency: n.price_currency,
            category_id: n.category_id,
            condition: n.condition,
            specs: n.specs,
            compatible_vehicles: n.compatible_vehicles,
          },
          source,
          args.dryRun,
        );

        if (partId) {
          await upsertOfferRow(
            partId,
            source,
            raw,
            { price: n.price, price_eur: n.price_eur, price_currency: n.price_currency },
            args.dryRun,
          );
          await insertFitmentClaims(partId, n.compatible_vehicles || [], source, args.dryRun);
        }
        upserted++;
      } catch (e: any) {
        skipped++;
        errors.push(`${raw.part_number || raw.raw_name}: ${e.message}`);
        if (errors.length <= 5) console.warn(`[backfill] ${source} write fail: ${e.message}`);
      }
    }

    // Capture scraper-level errors too
    for (const e of scraper.getErrors()) errors.push(e);

    const status: 'success' | 'partial' = errors.length > 0 ? 'partial' : 'success';
    await finishRun(runId, status, { parts_found: found, parts_upserted: upserted, parts_skipped: skipped }, errors);
    return { source, ok: true, counts: { parts_found: found, parts_upserted: upserted, parts_skipped: skipped }, errors };
  } catch (e: any) {
    const msg = e?.message || String(e);
    errors.push(msg);
    console.error(`[backfill] ${source} FAILED: ${msg}`);
    await finishRun(runId, 'failed', { parts_found: found, parts_upserted: upserted, parts_skipped: skipped }, errors);
    return { source, ok: false, counts: { parts_found: found, parts_upserted: upserted, parts_skipped: skipped }, errors };
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  console.log('[backfill] args:', args);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('[backfill] NEXT_PUBLIC_SUPABASE_URL not set — check .env.local');
    process.exit(1);
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !args.dryRun) {
    console.warn('[backfill] SUPABASE_SERVICE_ROLE_KEY not set; falling back to anon key. Writes may fail.');
  }

  await ensureSuppliers(args.dryRun);

  const results: Array<Awaited<ReturnType<typeof runSource>>> = [];
  for (const src of args.sources) {
    if (!(SOURCE_NAMES as readonly string[]).includes(src)) {
      console.warn(`[backfill] skipping unknown source: ${src}`);
      continue;
    }
    results.push(await runSource(src, args));
  }

  // Summary
  console.log('\n[backfill] ===== SUMMARY =====');
  let anyFailed = false;
  for (const r of results) {
    const tag = r.ok ? 'OK' : 'FAIL';
    console.log(
      `[backfill] ${tag} ${r.source}: found=${r.counts.parts_found} upserted=${r.counts.parts_upserted} skipped=${r.counts.parts_skipped} errors=${r.errors.length}`,
    );
    if (!r.ok) anyFailed = true;
  }

  process.exit(anyFailed ? 1 : 0);
}

main().catch((e) => {
  console.error('[backfill] fatal:', e);
  process.exit(1);
});
