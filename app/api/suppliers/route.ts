import { NextRequest, NextResponse } from 'next/server';
import { getSuppliers, getSupplierById } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const supplier = await getSupplierById(id);
      if (!supplier) return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
      return NextResponse.json({ data: supplier });
    }
    const suppliers = await getSuppliers(searchParams.get('all') !== 'true');
    return NextResponse.json(
      { data: suppliers, meta: { total: suppliers.length } },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
