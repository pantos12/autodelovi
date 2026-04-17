import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPartById, getPartBySlug } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RSD_TO_EUR = 117.5;

export async function POST(request: NextRequest) {
  try {
    const { part_id, quantity = 1 } = await request.json();
    if (!part_id) {
      return NextResponse.json({ error: 'part_id is required' }, { status: 400 });
    }

    const qty = Math.max(1, Math.min(10, parseInt(String(quantity)) || 1));

    const part = (await getPartBySlug(part_id)) ?? (await getPartById(part_id));
    if (!part) return NextResponse.json({ error: 'Part not found' }, { status: 404 });
    if ((part.stock_quantity ?? 0) < qty) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret || secret === 'sk_test_...') {
      return NextResponse.json(
        { error: 'Stripe not configured. Set STRIPE_SECRET_KEY.' },
        { status: 503 }
      );
    }

    const stripe = new Stripe(secret, { apiVersion: '2026-03-25.dahlia' });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const unitAmountEur = part.price_eur
      ? Math.round(part.price_eur * 100)
      : Math.round((part.price / RSD_TO_EUR) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: unitAmountEur,
            product_data: {
              name: part.name_sr || part.name,
              description: part.part_number ? `Part #: ${part.part_number}` : undefined,
              images: part.images?.[0] ? [part.images[0]] : undefined,
              metadata: {
                part_id: part.id,
                part_number: part.part_number,
                supplier_id: part.supplier_id,
              },
            },
          },
          quantity: qty,
        },
      ],
      metadata: {
        part_id: part.id,
        part_slug: part.slug,
        supplier_id: part.supplier_id,
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/parts/${part.slug || part.id}?canceled=1`,
      locale: 'auto',
    });

    return NextResponse.json({ url: session.url, session_id: session.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}
