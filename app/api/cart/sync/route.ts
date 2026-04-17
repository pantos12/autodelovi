import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { CartItem } from '@/lib/cart';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SyncBody {
  session_id: string;
  items: CartItem[];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as SyncBody | null;
    if (!body || typeof body.session_id !== 'string' || !Array.isArray(body.items)) {
      return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
    }

    const { session_id, items } = body;

    // 1) Upsert cart row by session_id
    const { data: cartRow, error: upsertErr } = await supabaseAdmin
      .from('carts')
      .upsert(
        {
          session_id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'session_id' }
      )
      .select('id')
      .single();

    if (upsertErr || !cartRow) {
      return NextResponse.json(
        { ok: false, error: upsertErr?.message || 'cart_upsert_failed' },
        { status: 200 }
      );
    }

    const cartId = (cartRow as { id: string }).id;

    // 2) Delete existing items for this cart
    const { error: delErr } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('cart_id', cartId);

    if (delErr) {
      return NextResponse.json(
        { ok: false, error: delErr.message },
        { status: 200 }
      );
    }

    // 3) Insert fresh items (if any)
    if (items.length > 0) {
      const rows = items.map(it => ({
        cart_id: cartId,
        part_id: it.part_id,
        quantity: it.quantity,
        name: it.name,
        brand: it.brand,
        price: it.price,
        price_currency: it.price_currency,
        image_url: it.image_url,
        supplier_id: it.supplier_id,
        supplier_name: it.supplier_name,
        part_number: it.part_number,
      }));
      const { error: insErr } = await supabaseAdmin.from('cart_items').insert(rows);
      if (insErr) {
        return NextResponse.json(
          { ok: false, error: insErr.message },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 200 });
  }
}
