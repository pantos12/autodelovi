import { NextRequest, NextResponse } from 'next/server';
import { getPriceHistory } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: { partId: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const days = Math.min(parseInt(searchParams.get('days') ?? '30'), 365);
    const history = await getPriceHistory(params.partId, days);
    const prices = history.map(h => h.price);
    const stats = prices.length > 0 ? {
      min: Math.min(...prices), max: Math.max(...prices),
      avg: prices.reduce((a,b) => a+b, 0) / prices.length,
      current: prices[prices.length - 1],
      change_pct: prices.length > 1 ? ((prices[prices.length-1] - prices[0]) / prices[0]) * 100 : 0,
    } : null;
    return NextResponse.json(
      { data: history, stats, meta: { days, total: history.length } },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800' } }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
