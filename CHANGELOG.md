# Changelog

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
