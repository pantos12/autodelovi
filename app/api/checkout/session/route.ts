import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { computeShipping } from '@/lib/shipping';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface CheckoutItemInput {
  part_id: string;
  quantity: number;
}

interface BuyerInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal?: string;
  notes?: string;
}

interface CheckoutBody {
  session_id: string;
  items: CheckoutItemInput[];
  buyer: BuyerInput;
}

interface PartRow {
  id: string;
  name: string;
  part_number: string | null;
  brand: string | null;
  supplier_id: string | null;
  images: string[] | null;
  price: number;
  stock_quantity: number;
  supplier: { name: string | null } | null;
}

interface ResolvedItem {
  part: PartRow;
  quantity: number;
  lineTotal: number;
}

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

function generateOrderNumber(): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const rand = randomBytes(3).toString('hex').toUpperCase(); // 6 hex chars
  return `AD-${yyyy}${mm}${dd}-${rand}`;
}

function validateBody(body: unknown): CheckoutBody | string {
  if (!body || typeof body !== 'object') return 'Invalid request body';
  const b = body as Record<string, unknown>;

  if (typeof b.session_id !== 'string' || !b.session_id.trim()) {
    return 'session_id is required';
  }
  if (!Array.isArray(b.items) || b.items.length === 0) {
    return 'items must be a non-empty array';
  }
  for (const raw of b.items) {
    if (!raw || typeof raw !== 'object') return 'Invalid item';
    const it = raw as Record<string, unknown>;
    if (typeof it.part_id !== 'string' || !it.part_id) return 'item.part_id is required';
    if (typeof it.quantity !== 'number' || !Number.isFinite(it.quantity) || it.quantity <= 0) {
      return 'item.quantity must be a positive number';
    }
  }
  if (!b.buyer || typeof b.buyer !== 'object') return 'buyer is required';
  const buyer = b.buyer as Record<string, unknown>;
  const required: Array<keyof BuyerInput> = ['name', 'email', 'phone', 'address', 'city'];
  for (const key of required) {
    const v = buyer[key];
    if (typeof v !== 'string' || !v.trim()) return `buyer.${key} is required`;
  }
  // Minimal email sanity check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email as string)) {
    return 'buyer.email is invalid';
  }
  return {
    session_id: b.session_id,
    items: b.items as CheckoutItemInput[],
    buyer: {
      name: (buyer.name as string).trim(),
      email: (buyer.email as string).trim(),
      phone: (buyer.phone as string).trim(),
      address: (buyer.address as string).trim(),
      city: (buyer.city as string).trim(),
      postal: typeof buyer.postal === 'string' ? buyer.postal.trim() || undefined : undefined,
      notes: typeof buyer.notes === 'string' ? buyer.notes.trim() || undefined : undefined,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return bad('Invalid JSON body');
    }

    const parsed = validateBody(rawBody);
    if (typeof parsed === 'string') return bad(parsed);
    const { items, buyer } = parsed;

    // Fetch and validate parts
    const resolved: ResolvedItem[] = [];
    for (const item of items) {
      const { data, error } = await supabaseAdmin
        .from('parts_v2')
        .select('id, name, part_number, brand, supplier_id, images, price, stock_quantity, supplier:suppliers(name)')
        .eq('id', item.part_id)
        .maybeSingle();

      if (error) {
        return bad(`Failed to load part ${item.part_id}: ${error.message}`, 500);
      }
      if (!data) {
        return bad(`Part not found: ${item.part_id}`, 404);
      }
      // supabase-js types join as array-or-object; normalize
      const part = data as unknown as PartRow & { supplier: { name: string | null } | { name: string | null }[] | null };
      const supplier = Array.isArray(part.supplier) ? (part.supplier[0] ?? null) : part.supplier;
      const normalized: PartRow = { ...part, supplier };

      if (typeof normalized.price !== 'number' || normalized.price <= 0) {
        return bad(`Part ${normalized.id} has no valid price`, 409);
      }
      if ((normalized.stock_quantity ?? 0) < item.quantity) {
        return bad(`Insufficient stock for ${normalized.name}`, 409);
      }

      resolved.push({
        part: normalized,
        quantity: item.quantity,
        lineTotal: Number((normalized.price * item.quantity).toFixed(2)),
      });
    }

    const subtotal = Number(
      resolved.reduce((acc, r) => acc + r.lineTotal, 0).toFixed(2)
    );
    const shipping_fee = computeShipping(subtotal);
    const total = Number((subtotal + shipping_fee).toFixed(2));
    const order_number = generateOrderNumber();
    const currency = 'RSD';

    // Insert order
    const { data: orderRow, error: orderErr } = await supabaseAdmin
      .from('orders_v2')
      .insert({
        order_number,
        buyer_email: buyer.email,
        buyer_name: buyer.name,
        buyer_phone: buyer.phone,
        shipping_address: buyer.address,
        shipping_city: buyer.city,
        shipping_postal: buyer.postal ?? null,
        shipping_country: 'RS',
        notes: buyer.notes ?? null,
        subtotal,
        shipping_fee,
        total,
        currency,
        status: 'pending',
        payment_method: 'stripe',
      })
      .select('id, order_number')
      .single();

    if (orderErr || !orderRow) {
      return bad(`Failed to create order: ${orderErr?.message ?? 'unknown error'}`, 500);
    }

    // Insert order items
    const itemRows = resolved.map((r) => ({
      order_id: orderRow.id,
      part_id: r.part.id,
      part_name: r.part.name,
      part_number: r.part.part_number,
      brand: r.part.brand,
      supplier_id: r.part.supplier_id,
      supplier_name: r.part.supplier?.name ?? null,
      image_url: r.part.images?.[0] ?? null,
      quantity: r.quantity,
      unit_price: r.part.price,
      line_total: r.lineTotal,
    }));

    const { error: itemsErr } = await supabaseAdmin.from('order_items_v2').insert(itemRows);
    if (itemsErr) {
      return bad(`Failed to insert order items: ${itemsErr.message}`, 500);
    }

    const origin = new URL(request.url).origin;

    // If Stripe is not configured, return pending order (dev fallback)
    if (!isStripeConfigured()) {
      console.warn('[checkout] STRIPE_SECRET_KEY missing/placeholder — skipping Stripe session creation.');
      return NextResponse.json({
        url: `/order/${orderRow.id}?status=pending`,
        order_number: orderRow.order_number,
        order_id: orderRow.id,
        stripe_skipped: true,
      });
    }

    // Build Stripe line items
    const line_items = resolved.map((r) => ({
      quantity: r.quantity,
      price_data: {
        currency: 'rsd',
        unit_amount: Math.round(r.part.price * 100),
        product_data: {
          name: r.part.name,
          description: r.part.part_number
            ? `Br. ${r.part.part_number}${r.part.brand ? ' • ' + r.part.brand : ''}`
            : undefined,
          images: r.part.images?.[0] ? [r.part.images[0]] : undefined,
          metadata: {
            part_id: r.part.id,
            supplier_id: r.part.supplier_id ?? '',
          },
        },
      },
    }));

    if (shipping_fee > 0) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: 'rsd',
          unit_amount: Math.round(shipping_fee * 100),
          product_data: {
            name: 'Dostava',
            description: undefined,
            images: undefined,
            metadata: { part_id: 'shipping', supplier_id: '' },
          },
        },
      });
    }

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items,
        customer_email: buyer.email,
        success_url: `${origin}/order/{CHECKOUT_SESSION_ID}?status=success&order_id=${orderRow.id}`,
        cancel_url: `${origin}/checkout?cancelled=1`,
        metadata: {
          order_id: orderRow.id,
          order_number: orderRow.order_number,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Stripe session creation failed';
      // Attempt to mark order as failed so we don't leave stale pending
      await supabaseAdmin
        .from('orders_v2')
        .update({ status: 'cancelled' })
        .eq('id', orderRow.id);
      return bad(`Stripe error: ${message}`, 502);
    }

    // Save session id on order
    const { error: updErr } = await supabaseAdmin
      .from('orders_v2')
      .update({ stripe_session_id: session.id })
      .eq('id', orderRow.id);
    if (updErr) {
      console.warn('[checkout] Failed to save stripe_session_id:', updErr.message);
    }

    return NextResponse.json({
      url: session.url,
      order_number: orderRow.order_number,
      order_id: orderRow.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    console.error('[checkout] Unhandled error:', message);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
