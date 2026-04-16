import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY || '';

export const stripe = new Stripe(secretKey, {
  // Use a current stable API version. If the installed stripe package requires
  // a different literal, casting keeps runtime tolerant across minor bumps.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: '2024-12-18.acacia' as any,
  typescript: true,
});

export const STRIPE_MODE: 'live' | 'test' = secretKey.startsWith('sk_live_') ? 'live' : 'test';

export const isStripeConfigured = (): boolean =>
  secretKey.startsWith('sk_') && !secretKey.includes('REPLACE_ME');
