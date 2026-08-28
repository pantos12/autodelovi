import { NextRequest, NextResponse } from 'next/server';
import { runAllSuppliers, getScraperByName, SOURCE_NAMES, type SourceName } from '@/lib/scraper';
import { runScrapingPipeline } from '@/lib/scraper';
import { getSuppliers } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const source = new URL(request.url).searchParams.get('source');
  const startTime = Date.now();
  console.log(`[Cron scrape-all] Starting at ${new Date().toISOString()}${source ? ` (source=${source})` : ' (all)'}`);

  try {
    let results;

    if (source && (SOURCE_NAMES as readonly string[]).includes(source)) {
      const suppliers = await getSuppliers(true);
      const supplier = suppliers.find(s => s.id === source);
      if (!supplier) {
        return NextResponse.json({ error: `Supplier not found: ${source}` }, { status: 404 });
      }
      const result = await runScrapingPipeline(supplier, 'cron');
      results = [result];
    } else {
      results = await runAllSuppliers('cron');
    }

    const summary = {
      triggered_at: new Date().toISOString(),
      source: source || 'all',
      duration_ms: Date.now() - startTime,
      suppliers_processed: results.length,
      total_parts_found: results.reduce((a,r) => a + r.scrape_result.parts_fetched, 0),
      total_upserted: results.reduce((a,r) => a + r.db_result.upserted, 0),
      total_price_changes: results.reduce((a,r) => a + r.db_result.price_changes, 0),
      failures: results.filter(r => r.status === 'failed').map(r => r.supplier_id),
    };
    console.log('[Cron scrape-all] Done:', summary);
    return NextResponse.json({ success: true, summary });
  } catch (err: any) {
    console.error('[Cron scrape-all] Failed:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
