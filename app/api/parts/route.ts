import { NextRequest, NextResponse } from 'next/server';
import { getParts } from '@/lib/supabase';
import type { PartsQueryParams } from '@/lib/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const VALID_SORTS = ['price_asc', 'price_desc', 'name_asc', 'newest'] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') ?? 'newest';
    const params: PartsQueryParams = {
      q:         searchParams.get('q')?.slice(0, 200) ?? undefined,
      category:  searchParams.get('category') ?? undefined,
      make:      searchParams.get('make') ?? undefined,
      model:     searchParams.get('model') ?? undefined,
      year:      searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
      supplier:  searchParams.get('supplier') ?? undefined,
      min_price: searchParams.get('min_price') ? Math.max(0, parseFloat(searchParams.get('min_price')!)) : undefined,
      max_price: searchParams.get('max_price') ? Math.max(0, parseFloat(searchParams.get('max_price')!)) : undefined,
      in_stock:  searchParams.get('in_stock') === 'true' ? true : undefined,
      sort:      VALID_SORTS.includes(sort as any) ? sort as any : 'newest',
      page:      Math.max(1, parseInt(searchParams.get('page') ?? '1') || 1),
      per_page:  Math.min(Math.max(1, parseInt(searchParams.get('per_page') ?? '24') || 24), 100),
    };
    const result = await getParts(params);
    return NextResponse.json(
      { data: result.parts, meta: { total: result.total, page: result.page, per_page: result.per_page, total_pages: result.total_pages } },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
