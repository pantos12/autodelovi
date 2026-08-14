import { NextRequest, NextResponse } from 'next/server';
import { getParts, supabase } from '@/lib/supabase';
import { computeBand } from '@/lib/confidence';
import type { PartsQueryParams, Offer } from '@/lib/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: PartsQueryParams = {
      q:         searchParams.get('q') ?? undefined,
      category:  searchParams.get('category') ?? undefined,
      make:      searchParams.get('make') ?? undefined,
      model:     searchParams.get('model') ?? undefined,
      year:      searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
      supplier:  searchParams.get('supplier') ?? undefined,
      min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
      max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
      in_stock:  searchParams.get('in_stock') === 'true' ? true : undefined,
      sort:      (searchParams.get('sort') as any) ?? 'newest',
      page:      searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      per_page:  Math.min(parseInt(searchParams.get('per_page') ?? '24'), 100),
    };
    const result = await getParts(params);

    const now = new Date();
    const partIds = result.parts.map(p => p.id);
    let offersByPart: Record<string, Offer[]> = {};

    if (partIds.length > 0) {
      try {
        const { data: offers } = await supabase
          .from('offers')
          .select('id, part_id, price, price_currency, stock_signal_strength, last_check_status, last_seen_at')
          .in('part_id', partIds);

        if (offers) {
          for (const o of offers as Offer[]) {
            (offersByPart[o.part_id] ??= []).push(o);
          }
        }
      } catch {
        // offers table may not exist yet — fall back to stock_quantity
      }
    }

    const enrichedParts = result.parts.map(part => {
      const offers = offersByPart[part.id];
      if (offers && offers.length > 0) {
        const bands = offers.map(o => ({ offer: o, band: computeBand(o, now) }));
        const eligible = bands.filter(b => b.band !== 'inquiry');
        const bestBand = eligible.length > 0
          ? eligible.reduce((best, cur) => cur.offer.price < best.offer.price ? cur : best).band
          : bands[0].band;
        return { ...part, band: bestBand };
      }
      return { ...part, band: (part.stock_quantity ?? 0) > 0 ? 'verified' : 'inquiry' };
    });

    return NextResponse.json(
      { data: enrichedParts, meta: { total: result.total, page: result.page, per_page: result.per_page, total_pages: result.total_pages } },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
