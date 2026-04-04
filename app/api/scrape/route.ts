import { NextRequest, NextResponse } from 'next/server';
import { runScrapingPipeline, runAllSuppliers } from '@/lib/scraper';
import { getSupplierById, getRecentJobs } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function isAuthorized(request: NextRequest): boolean {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const cronSecret = request.headers.get('x-cron-secret');
  return token === process.env.SCRAPE_API_SECRET || cronSecret === process.env.CRON_SECRET;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json().catch(() => ({}));
    const { supplier_id, all = false, max_pages = 10 } = body as { supplier_id?: string; all?: boolean; max_pages?: number };

    if (all) {
      const results = await runAllSuppliers('api');
      return NextResponse.json({
        success: true, results,
        summary: {
          suppliers_processed: results.length,
          total_upserted: results.reduce((a,r) => a + r.db_result.upserted, 0),
          total_price_changes: results.reduce((a,r) => a + r.db_result.price_changes, 0),
          failures: results.filter(r => r.status === 'failed').length,
        },
      });
    }

    if (!supplier_id) return NextResponse.json({ error: 'Provide supplier_id or set all=true' }, { status: 400 });

    const supplier = await getSupplierById(supplier_id);
    if (!supplier) return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });

    const result = await runScrapingPipeline(supplier, 'api', max_pages);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const jobs = await getRecentJobs(limit);
    return NextResponse.json({ data: jobs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
