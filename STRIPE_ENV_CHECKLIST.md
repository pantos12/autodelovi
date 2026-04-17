# Stripe Environment Checklist (Vercel Production)

This is a documentation-only checklist for the v3.3.0 release. Verify each
variable exists in **Vercel → Project → Settings → Environment Variables →
Production** before promoting a deployment.

## Required environment variables

| Variable | Scope | Example / expected value |
|---|---|---|
| `STRIPE_SECRET_KEY` | Server-only | `sk_live_...` (live mode) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public (bundled into client) | `pk_live_...` (live mode) |
| `STRIPE_WEBHOOK_SECRET` | Server-only | `whsec_...` (from the webhook endpoint below) |
| `NEXT_PUBLIC_APP_URL` | Public | `https://autodelovi.sale` (no trailing slash) |

Notes:
- Use **test mode** keys (`sk_test_...`, `pk_test_...`) for Preview / Development
  scopes, not Production.
- `STRIPE_WEBHOOK_SECRET` is per-endpoint — each environment (test vs live)
  has its own secret. Do not share across scopes.
- `NEXT_PUBLIC_APP_URL` is used to build `success_url` / `cancel_url` fallbacks
  and email links. It must match the canonical production hostname exactly.

## Stripe webhook endpoint

Configure in **Stripe Dashboard → Developers → Webhooks**:

- **Endpoint URL:** `https://autodelovi.sale/api/stripe/webhook`
- **API version:** account default (or the version pinned in `lib/stripe.ts`)
- **Subscribed events:**
  - `checkout.session.completed`
  - `checkout.session.expired`
  - `checkout.session.async_payment_failed`

After creating the endpoint, copy the signing secret (`whsec_...`) into
`STRIPE_WEBHOOK_SECRET` on Vercel Production and redeploy.

## Quick verification

1. Hit `/api/health` (or any page) on the live URL — no 500s from missing env.
2. Complete a real card checkout in live mode with a small-amount test order;
   confirm the webhook fires (Stripe dashboard → webhook → recent deliveries
   shows 200 OK) and the `orders_v2` row flips from `pending` to `paid`.
3. Cancel a checkout session and verify `checkout.session.expired` handling.
