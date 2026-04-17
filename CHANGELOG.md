# Changelog

## [3.3.0] - 2026-04-16

### Added — Catalog depth + trustable stock + payable checkout

**Database (6 new tables):** `merchants`, `offers`, `fitment_claims`, `vin_cache`, `inquiries`, `backfill_runs`. Schema extends `parts_v2` (no rebuild). RLS policies added for each.

**Stock confidence bands** — 3-band UI (🟢 Na stanju · provereno / 🟡 Verovatno dostupno / 🔴 Proveri sa prodavcem), computed at read-time from `offers.stock_signal_strength` + `last_check_status` + `last_seen_at`. Evidence fields preserved (raw signal text, check status). See `lib/confidence.ts`.

**Stripe checkout fix** — aligned client form field names with server validator (`name/email/phone/address/city/postal/notes`); fixed missing `image_url` in `/checkout` summary; hardened session_id fallback.

**Inquiry flow** — `POST /api/inquiries`, `<InquiryModal>`, `<InquiryButton>` for 🔴 Na-upit products (hidden add-to-cart, inquiry form instead).

**VIN decoding** — `GET /api/vin/[vin]` proxies NHTSA vPIC with 24h `vin_cache` and field allowlist; VIN input on `/vehicle-selection` pre-fills Make/Model/Year. Graceful partial-decode for European VINs.

**5 scrapers** — AutoHub and ProdajaDelova polished to emit `stock_signal_strength`/`stock_signal_raw`/`last_check_status`. New: DeloviOnline, ALVADI Serbia, PolovniAutomobili (playwright-extra + stealth). `scripts/backfill.ts` CLI with `--source`, `--limit`, `--dry-run`, `--since`, `backfill_runs` checkpoint.

**Marketplace UX** — 24-per-page pagination (was 60), band badge on every card, "Dostupnost proverena skoro" disclaimer on 🟡, "Samo dostupno" filter, skeleton loaders, Next.js `<Image>` with `remotePatterns` whitelist + lazy loading.

**Playwright E2E — 99 tests / 14 files** across chromium/firefox/webkit. Tier 1: 12 critical-flow specs. Tier 2: button inventory crawler with allow/deny filter. Tier 3: 11 API route smoke tests via `APIRequestContext`. CI workflow `.github/workflows/e2e-preview.yml` triggered by `repository_dispatch: vercel.deployment.success`, 4 shards × 1 worker, Vercel Protection Bypass via `VERCEL_AUTOMATION_BYPASS_SECRET`.

### Changed
- `parts_v2.supplier_id` FK extended with 5 new merchant IDs (`autohub`, `prodajadelova`, `delovionline`, `alvadi`, `polovniautomobili`) — backfill script upserts rows into `suppliers` so the FK resolves.
- `next.config.js` externalizes `playwright-extra` / `puppeteer-extra-plugin-stealth` to keep webpack from trying to bundle their dynamic requires.

### Out of scope / deferred
- HaloOglasi, KupujemProdajem, Deloovi, Autodelovi.net scrapers → v3.4+.
- Scrapling (Python stealth service) → v3.4+ for KupujemProdajem.
- Supabase Storage image cache / proxy → free-tier strategy; remote URLs only.
- CarQuery API → permanently out.
- TecDoc / direct stock feeds → Track B procurement.
- Visual regression testing → v3.5.

## [3.2.0] - 2026-04-16

### Added
- **Shopping cart** with localStorage persistence + best-effort Supabase sync
  - `lib/cart.ts` pure isomorphic cart library (getCart, addToCart, updateQuantity, removeFromCart, clearCart, getCartTotal, syncToSupabase)
  - `app/components/CartProvider.tsx` React context + `useCart()` hook
  - `app/components/AddToCartButton.tsx` reusable button with in-stock awareness and "Dodato u korpu ✓" confirmation
  - Cart icon + count badge in NavBar (desktop + mobile)
- **`/cart` page** — itemized cart with quantity steppers, supplier info, remove buttons, summary card (subtotal, shipping, total), and "Poruči" CTA
- **`/checkout` page** — guest checkout form (name, email, phone, address, city, postal, notes)
- **`/order/[id]` page** — server-rendered confirmation with order number, buyer details, shipping address, itemized list, totals, and paid/pending badge
- **Stripe integration**
  - `lib/stripe.ts` Stripe client singleton + `isStripeConfigured()` helper
  - `POST /api/checkout/session` creates order + Stripe Checkout Session (currency RSD, shipping line item, metadata), graceful fallback for dev when Stripe keys are placeholders
  - `POST /api/webhook/stripe` verifies signature and updates order status on `checkout.session.completed`, `expired`, `async_payment_failed`
  - Env placeholders wired into `.env.local` and `.env.example`
- **Database schema** — `carts`, `cart_items`, `orders_v2`, `order_items_v2` tables + RLS policies + `gen_order_number()` helper
- **`/api/cart/sync`** endpoint for persisting cart to Supabase
- **v2 table naming** (`orders_v2`, `order_items_v2`) to avoid collision with legacy schema's `orders` table

### Changed
- Marketplace grid now shows "Dodaj u korpu" as the primary CTA; "Detalji" moved to secondary
- `supabaseAdmin` gracefully falls back to the anon key when `SUPABASE_SERVICE_ROLE_KEY` is missing, using the permissive RLS policies on the checkout tables
- `.env` stripped of truncated placeholder Supabase keys (they were overriding `.env.local`)

### Fixed
- Stripe SDK v22 type namespace renames (`Stripe.LatestApiVersion`, `Stripe.Checkout.SessionCreateParams.LineItem`) — cast/removed as needed
- Order confirmation page column names aligned with actual schema (`shipping_fee`, `currency`, `part_name`)

## [3.1.0] - 2026-04-16

### Added
- Real product images for all 12 seed parts (MANN-FILTER, BOSCH, SACHS, NGK, ContiTech, LuK, VALEO, WALKER, TRW, INA, BLIC)
- Image URLs pulled from Spareto CDN, Autodoc CDN, Summit Racing, and AIBearing
- Standalone Next.js output for Docker deployment (`next.config.js`)
- `Dockerfile` for containerized production builds
- `.gitignore` to protect secrets and build artifacts
- `package-lock.json` for reproducible installs
- `CHANGELOG.md` for version tracking

### Changed
- Supabase queries updated to target `parts_v2` table (avoids collision with legacy schema)
- Scraper error handling — `partNum` variable now properly scoped for catch block

### Fixed
- `lib/scraper/index.ts` reference-out-of-scope compile error
- Full-text search `unaccent` function now wrapped as `immutable_unaccent` for index usability

## [3.0.x] - Prior
- Initial marketplace, supplier directory, vehicle selector, comparison tool
- 4 scraping sources (AutoHub, Halo Oglasi, ProdajaDelova, Demo)
- Vercel cron jobs for daily scraping
