import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret || secret === 'sk_test_...' || webhookSecret === 'whsec_...') {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const body = await request.text();
  const stripe = new Stripe(secret, { apiVersion: '2026-03-25.dahlia' });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      // Idempotency: check if this event was already processed
      const { data: existing } = await supabaseAdmin
        .from('stripe_events')
        .select('id')
        .eq('event_id', event.id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      // Record event before processing to prevent concurrent duplicates
      try {
        await supabaseAdmin
          .from('stripe_events')
          .insert({ event_id: event.id, event_type: event.type, processed_at: new Date().toISOString() });
      } catch {
        // Table may not exist yet; proceed without idempotency guard
      }

      const session = event.data.object as Stripe.Checkout.Session;
      const partId = session.metadata?.part_id;
      if (partId && session.payment_status === 'paid') {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
        const qty = lineItems.data[0]?.quantity ?? 1;

        // Atomic stock decrement using RPC to avoid read-then-write race
        const { error: rpcError } = await supabaseAdmin.rpc('decrement_stock', {
          p_part_id: partId,
          p_quantity: qty,
        });

        if (rpcError) {
          // Fallback: direct update if RPC doesn't exist yet
          const { data: currentPart } = await supabaseAdmin
            .from('parts')
            .select('stock_quantity')
            .eq('id', partId)
            .single();

          if (currentPart) {
            const newStock = Math.max(0, (currentPart.stock_quantity ?? 0) - qty);
            await supabaseAdmin
              .from('parts')
              .update({
                stock_quantity: newStock,
                status: newStock === 0 ? 'out_of_stock' : 'active',
                updated_at: new Date().toISOString(),
              })
              .eq('id', partId);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 500 });
  }
}
