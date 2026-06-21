import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function sanitizeSearchInput(input: string): string {
  return input.replace(/[%_\\]/g, c => '\\' + c);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  if (!q || q.length < 2) return NextResponse.json({ data: [], meta: { total: 0 } });
  if (q.length > 200) return NextResponse.json({ data: [], meta: { total: 0, error: 'Query too long' } });

  try {
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1') || 1);
    const perPage = Math.min(Math.max(1, parseInt(searchParams.get('per_page') ?? '20') || 20), 50);
    const category = searchParams.get('category') ?? null;
    const minPrice = searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : null;
    const maxPrice = searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : null;
    const inStock = searchParams.get('in_stock') === 'true' ? true : null;

    const { data, error } = await supabase.rpc('search_parts', {
      query: q, category_filter: category, min_price_filter: minPrice,
      max_price_filter: maxPrice, in_stock_filter: inStock, page_num: page, page_size: perPage,
    });

    if (error) {
      const safeQ = sanitizeSearchInput(q);
      const { data: fb, count } = await supabase
        .from('parts_v2')
        .select('id,slug,name,name_sr,brand,part_number,oem_number,price,price_eur,stock_quantity,images,category_id,supplier_id,compatible_vehicles,condition,status,slug', { count: 'exact' })
        .or(`name.ilike.%${safeQ}%,name_sr.ilike.%${safeQ}%,part_number.ilike.%${safeQ}%,brand.ilike.%${safeQ}%,oem_number.ilike.%${safeQ}%`)
        .in('status', ['active','out_of_stock'])
        .order('price', { ascending: true })
        .range((page-1)*perPage, page*perPage-1);
      return NextResponse.json(
        { data: fb ?? [], meta: { total: count ?? 0, page, per_page: perPage, total_pages: Math.ceil((count ?? 0) / perPage) } },
        { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' } }
      );
    }

    const total = data?.[0]?.total_count ?? 0;
    return NextResponse.json(
      { data: data ?? [], meta: { total, page, per_page: perPage, total_pages: Math.ceil(total/perPage), query: q } },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' } }
    );
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
