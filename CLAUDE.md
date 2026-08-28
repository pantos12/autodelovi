# AutoDelovi.sale

Serbian auto parts marketplace aggregator. Scrapes 5 Serbian sources (AutoHub, ProdajaDelova, DeloviOnline, Alvadi, PolovniAutomobili) and presents unified search/browse/buy.

## Stack
- **Framework**: Next.js 14 (App Router), TypeScript
- **Database**: Supabase (PostgreSQL + Auth)
- **Payments**: Stripe Checkout
- **Styling**: Inline React styles (Tailwind configured but not primary)
- **Deploy**: Vercel (standalone output, Docker-ready)
- **Language**: Serbian (sr_RS locale), currency RSD

## Commands
- `npm run dev` — dev server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint
- `node --test lib/confidence.test.ts` — unit tests
- `npx playwright test` — E2E tests (99 specs, 14 files)

## Key tables (Supabase)
`parts_v2`, `suppliers`, `categories`, `orders_v2`, `order_items_v2`, `offers`, `merchants`, `carts`, `cart_items`, `inquiries`, `price_history`, `scraping_jobs`, `vin_cache`, `profiles`

## Architecture
- `/app/api/parts` — edge, public parts listing with filters/pagination
- `/app/api/search` — edge, full-text search via `search_parts` RPC
- `/app/api/checkout/session` — creates order + Stripe session
- `/app/api/webhook/stripe` — handles payment events
- `/app/api/cron/scrape-all?source=X` — per-source scraping (staggered 04:00-04:25 UTC)
- `/lib/scraper/` — scraper pipeline: base class, normalizer, 5 source implementations
- `/lib/confidence.ts` — stock confidence bands (verified/likely/inquiry)
- `/lib/cart.ts` — isomorphic cart (localStorage + optional Supabase sync)

## Conventions
- All UI text in Serbian
- Prices in RSD (EUR conversion at 117.5 rate in normalizer)
- Parts identified by slug or UUID
- 7 static categories: motor, kocnice, elektronika, karoserija, suspenzija, transmisija, ostalo
- 12 vehicle makes supported in vehicle selection
