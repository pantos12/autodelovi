import { NextRequest, NextResponse } from 'next/server';
import { runAllSuppliers } from '@/lib/scraper';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// Vercel Cron: 0 4 * * * (daily at 04:00 UTC)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  console.log('[Cron scrape-all] Starting at', new Date().toISOString());

  try {
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
