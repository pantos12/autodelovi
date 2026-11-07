import { NextRequest, NextResponse } from 'next/server';
import { getParts } from '@/lib/supabase';
import type { PartsQueryParams } from '@/lib/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    function safeInt(val: string | null, fallback?: number): number | undefined {
      if (!val) return fallback;
      const n = parseInt(val);
      return Number.isFinite(n) ? n : fallback;
    }
    function safeFloat(val: string | null): number | undefined {
      if (!val) return undefined;
      const n = parseFloat(val);
      return Number.isFinite(n) ? n : undefined;
    }
    const params: PartsQueryParams = {
      q:         searchParams.get('q') ?? undefined,
      category:  searchParams.get('category') ?? undefined,
      make:      searchParams.get('make') ?? undefined,
      model:     searchParams.get('model') ?? undefined,
      year:      safeInt(searchParams.get('year')),
      supplier:  searchParams.get('supplier') ?? undefined,
      min_price: safeFloat(searchParams.get('min_price')),
      max_price: safeFloat(searchParams.get('max_price')),
      in_stock:  searchParams.get('in_stock') === 'true' ? true : undefined,
      sort:      (searchParams.get('sort') as any) ?? 'newest',
      page:      safeInt(searchParams.get('page'), 1),
      per_page:  Math.min(safeInt(searchParams.get('per_page'), 24)!, 100),
    };
    const result = await getParts(params);
    return NextResponse.json(
      { data: result.parts, meta: { total: result.total, page: result.page, per_page: result.per_page, total_pages: result.total_pages } },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
