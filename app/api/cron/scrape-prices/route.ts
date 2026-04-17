import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, recordPriceHistory, detectPriceChanges } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

// Vercel Cron: 0 */6 * * * (every 6 hours)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('[Cron scrape-prices] Starting at', new Date().toISOString());

  try {
    const { data: parts } = await supabaseAdmin
      .from('parts_v2')
      .select('id,part_number,supplier_id,price,source_url')
      .eq('status', 'active')
      .not('source_url', 'is', null)
      .order('scraped_at', { ascending: true })
      .limit(200);

    if (!parts || parts.length === 0) return NextResponse.json({ success: true, message: 'No parts to update' });

    const alerts = await detectPriceChanges(parts.map(p => ({ id: p.id, price: p.price, part_number: p.part_number, supplier_id: p.supplier_id })));
    let updated = 0;

    await Promise.allSettled(parts.map(async (part) => {
      try { await recordPriceHistory(part.id, part.supplier_id, part.price, 0, 'RSD'); updated++; } catch {}
    }));

    if (alerts.length > 0) console.log(`[Cron scrape-prices] ${alerts.length} price change(s) detected`);

    return NextResponse.json({
      success: true,
      summary: { triggered_at: new Date().toISOString(), parts_processed: parts.length, price_snapshots_recorded: updated, significant_changes: alerts.length, alerts: alerts.slice(0, 10) },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
