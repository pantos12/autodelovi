import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function sanitizeSearchQuery(raw: string): string {
  return raw.replace(/[%_\\]/g, '\\$&').slice(0, 200);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  if (!q || q.length < 2) return NextResponse.json({ data: [], meta: { total: 0 } });

  try {
    const rawPage = parseInt(searchParams.get('page') ?? '1');
    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
    const rawPerPage = parseInt(searchParams.get('per_page') ?? '20');
    const perPage = Math.min(Number.isFinite(rawPerPage) && rawPerPage > 0 ? rawPerPage : 20, 50);
    const category = searchParams.get('category') ?? null;
    const minPrice = searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : null;
    const maxPrice = searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : null;
    const inStock = searchParams.get('in_stock') === 'true' ? true : null;

    const { data, error } = await supabase.rpc('search_parts', {
      query: q, category_filter: category, min_price_filter: minPrice,
      max_price_filter: maxPrice, in_stock_filter: inStock, page_num: page, page_size: perPage,
    });

    if (error) {
      const safe = sanitizeSearchQuery(q);
      const { data: fb, count } = await supabase
        .from('parts_v2')
        .select('id,slug,name,brand,part_number,price,price_eur,stock_quantity,images,category_id,supplier_id', { count: 'exact' })
        .or(`name.ilike.%${safe}%,part_number.ilike.%${safe}%,brand.ilike.%${safe}%`)
        .in('status', ['active','out_of_stock'])
        .range((page-1)*perPage, page*perPage-1);
      return NextResponse.json({ data: fb ?? [], meta: { total: count ?? 0, page, per_page: perPage } });
    }

    const total = data?.[0]?.total_count ?? 0;
    return NextResponse.json(
      { data: data ?? [], meta: { total, page, per_page: perPage, total_pages: Math.ceil(total/perPage), query: q } },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' } }
    );
  } catch (err) {
    console.error('[search] Error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
