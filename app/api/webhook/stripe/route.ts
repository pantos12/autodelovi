import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function markOrderPaid(
  session: Stripe.Checkout.Session
): Promise<void> {
  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null;
  const orderIdMeta = session.metadata?.order_id;

  const updates = {
    status: 'paid',
    stripe_payment_intent_id: paymentIntentId,
    paid_at: new Date().toISOString(),
  };

  // Primary lookup by stripe_session_id
  const { data: bySession, error: sessErr } = await supabaseAdmin
    .from('orders_v2')
    .update(updates)
    .eq('stripe_session_id', session.id)
    .select('id');

  if (sessErr) {
    console.error('[stripe-webhook] update by session error:', sessErr.message);
  }

  if (!bySession || bySession.length === 0) {
    // Fallback to metadata.order_id
    if (orderIdMeta) {
      const { error: metaErr } = await supabaseAdmin
        .from('orders_v2')
        .update({ ...updates, stripe_session_id: session.id })
        .eq('id', orderIdMeta);
      if (metaErr) {
        console.error('[stripe-webhook] fallback update error:', metaErr.message);
      }
    } else {
      console.warn('[stripe-webhook] no order matched session', session.id);
    }
  }
}

async function markOrderCancelled(
  session: Stripe.Checkout.Session
): Promise<void> {
  const orderIdMeta = session.metadata?.order_id;
  const { data, error } = await supabaseAdmin
    .from('orders_v2')
    .update({ status: 'cancelled' })
    .eq('stripe_session_id', session.id)
    .select('id');

  if (error) console.error('[stripe-webhook] cancel by session error:', error.message);

  if ((!data || data.length === 0) && orderIdMeta) {
    const { error: metaErr } = await supabaseAdmin
      .from('orders_v2')
      .update({ status: 'cancelled' })
      .eq('id', orderIdMeta);
    if (metaErr) console.error('[stripe-webhook] cancel fallback error:', metaErr.message);
  }
}

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  if (!webhookSecret || webhookSecret.includes('REPLACE_ME')) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: 'Failed to read request body' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'invalid signature';
    console.warn('[stripe-webhook] signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await markOrderPaid(session);
        break;
      }
      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await markOrderCancelled(session);
        break;
      }
      default:
        // Acknowledge other events silently
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Handler error';
    console.error('[stripe-webhook] handler error:', message);
    // Return 500 so Stripe retries
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
