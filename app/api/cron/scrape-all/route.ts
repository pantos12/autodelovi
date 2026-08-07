import { NextRequest, NextResponse } from 'next/server';
import { runAllSuppliers, runScrapingPipeline, SOURCE_NAMES, SOURCE_DISPLAY_NAMES } from '@/lib/scraper';
import type { SourceName } from '@/lib/scraper';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');
  const startTime = Date.now();

  try {
    if (source && (SOURCE_NAMES as readonly string[]).includes(source)) {
      console.log(`[Cron scrape-all] Scraping source: ${source}`);
      const name = SOURCE_DISPLAY_NAMES[source as SourceName];
      const supplier = { id: source, name, slug: source, website: '', scrape_url: '', is_active: true, is_verified: false, status: 'active' as const, rating: 0, review_count: 0, city: '', created_at: '', updated_at: '' };
      const result = await runScrapingPipeline(supplier, 'cron');
      const summary = {
        triggered_at: new Date().toISOString(),
        duration_ms: Date.now() - startTime,
        source,
        parts_found: result.scrape_result.parts_fetched,
        upserted: result.db_result.upserted,
        price_changes: result.db_result.price_changes,
        status: result.status,
        error: result.error,
      };
      console.log('[Cron scrape-all] Done:', summary);
      return NextResponse.json({ success: result.status === 'success', summary });
    }

    console.log('[Cron scrape-all] Starting all suppliers');
    const results = await runAllSuppliers('cron');
    const summary = {
      triggered_at: new Date().toISOString(),
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
