import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(
  secretKey.startsWith('sk_') ? secretKey : 'sk_test_placeholder',
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2024-12-18.acacia' as any,
    typescript: true,
  }
);

export const STRIPE_MODE: 'live' | 'test' = secretKey.startsWith('sk_live_') ? 'live' : 'test';

export const isStripeConfigured = (): boolean =>
  secretKey.startsWith('sk_') && !secretKey.includes('REPLACE_ME');
