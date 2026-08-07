import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

let _stripe: Stripe | null = null;
function getOrCreateStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(secretKey, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiVersion: '2024-12-18.acacia' as any,
      typescript: true,
    });
  }
  return _stripe;
}

export { getOrCreateStripe as getStripe };

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    return Reflect.get(getOrCreateStripe(), prop, receiver);
  },
});

export const STRIPE_MODE: 'live' | 'test' = secretKey.startsWith('sk_live_') ? 'live' : 'test';

export const isStripeConfigured = (): boolean =>
  secretKey.startsWith('sk_') && !secretKey.includes('REPLACE_ME') && secretKey !== 'sk_test_placeholder';
