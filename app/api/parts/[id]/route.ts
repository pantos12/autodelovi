import { NextRequest, NextResponse } from 'next/server';
import { getPartById, getPartBySlug, getRelatedParts, getPriceHistory } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!/^[a-z0-9-]+$/i.test(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const part = isUUID
      ? await getPartById(id)
      : await getPartBySlug(id) ?? await getPartById(id);

    if (!part) return NextResponse.json({ error: 'Part not found' }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const [related, priceHistory] = await Promise.all([
      searchParams.get('related') !== 'false' ? getRelatedParts(part, 4) : Promise.resolve([]),
      searchParams.get('prices') === 'true' ? getPriceHistory(part.id, 30) : Promise.resolve([]),
    ]);

    return NextResponse.json(
      { data: part, related, price_history: priceHistory },
      { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' } }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
