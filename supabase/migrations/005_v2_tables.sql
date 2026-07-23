-- Migration 005: Create v2 tables referenced by the application.
-- parts_v2, orders_v2, order_items_v2, carts, cart_items, merchants,
-- offers, fitment_claims, vin_cache, inquiries, backfill_runs.

-- parts_v2: main parts table (renamed from parts in v3.1)
CREATE TABLE IF NOT EXISTS parts_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  name_sr TEXT,
  description TEXT,
  description_sr TEXT,
  brand TEXT,
  part_number TEXT,
  oem_number TEXT,
  category_id UUID REFERENCES categories(id),
  supplier_id UUID REFERENCES suppliers(id),
  price NUMERIC NOT NULL DEFAULT 0,
  price_eur NUMERIC,
  price_currency TEXT DEFAULT 'RSD',
  stock_quantity INTEGER DEFAULT 0,
  condition TEXT DEFAULT 'new' CHECK (condition IN ('new', 'used', 'refurbished')),
  images JSONB DEFAULT '[]'::jsonb,
  compatible_vehicles JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '{}'::jsonb,
  source_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'out_of_stock', 'discontinued')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(part_number, supplier_id)
);

CREATE INDEX IF NOT EXISTS idx_parts_v2_category ON parts_v2(category_id);
CREATE INDEX IF NOT EXISTS idx_parts_v2_supplier ON parts_v2(supplier_id);
CREATE INDEX IF NOT EXISTS idx_parts_v2_status ON parts_v2(status);
CREATE INDEX IF NOT EXISTS idx_parts_v2_slug ON parts_v2(slug);
CREATE INDEX IF NOT EXISTS idx_parts_v2_price ON parts_v2(price);

ALTER TABLE parts_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read parts_v2" ON parts_v2 FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Service write parts_v2" ON parts_v2 FOR ALL USING (auth.role() = 'service_role');

-- merchants: third-party sellers providing offers
CREATE TABLE IF NOT EXISTS merchants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT,
  logo_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read merchants" ON merchants FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Service write merchants" ON merchants FOR ALL USING (auth.role() = 'service_role');

-- offers: merchant-specific listings for a part
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID REFERENCES parts_v2(id) ON DELETE CASCADE,
  merchant_id TEXT REFERENCES merchants(id),
  price NUMERIC NOT NULL,
  price_currency TEXT DEFAULT 'RSD',
  stock_signal_strength TEXT CHECK (stock_signal_strength IN ('strong', 'weak', 'none')),
  stock_signal_raw TEXT,
  last_check_status TEXT CHECK (last_check_status IN ('in_stock', 'out_of_stock', 'unknown')),
  last_seen_at TIMESTAMPTZ,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_offers_part ON offers(part_id);
CREATE INDEX IF NOT EXISTS idx_offers_merchant ON offers(merchant_id);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read offers" ON offers FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Service write offers" ON offers FOR ALL USING (auth.role() = 'service_role');

-- fitment_claims: vehicle compatibility claims for offers
CREATE TABLE IF NOT EXISTS fitment_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT,
  year_from INTEGER,
  year_to INTEGER,
  engine TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fitment_offer ON fitment_claims(offer_id);

ALTER TABLE fitment_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read fitment" ON fitment_claims FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Service write fitment" ON fitment_claims FOR ALL USING (auth.role() = 'service_role');

-- vin_cache: NHTSA vPIC decode cache (24h TTL)
CREATE TABLE IF NOT EXISTS vin_cache (
  vin TEXT PRIMARY KEY,
  result JSONB NOT NULL,
  decoded_at TIMESTAMPTZ DEFAULT now(),
  success BOOLEAN DEFAULT true
);

ALTER TABLE vin_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read vin_cache" ON vin_cache FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Service write vin_cache" ON vin_cache FOR ALL USING (auth.role() = 'service_role');

-- inquiries: customer inquiries about parts
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID REFERENCES parts_v2(id),
  merchant_id TEXT REFERENCES merchants(id),
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_part ON inquiries(part_id);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Service manage inquiries" ON inquiries FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY IF NOT EXISTS "Public insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- backfill_runs: checkpoint for scraper backfill operations
CREATE TABLE IF NOT EXISTS backfill_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  finished_at TIMESTAMPTZ,
  parts_processed INTEGER DEFAULT 0,
  parts_upserted INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed'))
);

ALTER TABLE backfill_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Service manage backfill" ON backfill_runs FOR ALL USING (auth.role() = 'service_role');

-- carts: shopping cart persistence
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_carts_session ON carts(session_id);
CREATE INDEX IF NOT EXISTS idx_carts_user ON carts(user_id);

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Service manage carts" ON carts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY IF NOT EXISTS "Public insert carts" ON carts FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public read own cart" ON carts FOR SELECT USING (true);

-- cart_items: items within a cart
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  part_id UUID REFERENCES parts_v2(id),
  quantity INTEGER DEFAULT 1,
  price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Service manage cart_items" ON cart_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY IF NOT EXISTS "Public insert cart_items" ON cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public read cart_items" ON cart_items FOR SELECT USING (true);

-- Helper function for generating order numbers
CREATE OR REPLACE FUNCTION gen_order_number() RETURNS TEXT AS $$
DECLARE
  suffix TEXT;
BEGIN
  suffix := upper(substr(md5(random()::text), 1, 6));
  RETURN 'AD-' || to_char(now(), 'YYYYMMDD') || '-' || suffix;
END;
$$ LANGUAGE plpgsql;

-- orders_v2: order records (v2 to avoid collision with legacy orders table)
CREATE TABLE IF NOT EXISTS orders_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE DEFAULT gen_order_number(),
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal TEXT,
  notes TEXT,
  subtotal NUMERIC DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'RSD',
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_v2_user ON orders_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_v2_status ON orders_v2(status);
CREATE INDEX IF NOT EXISTS idx_orders_v2_stripe ON orders_v2(stripe_session_id);

ALTER TABLE orders_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Service manage orders_v2" ON orders_v2 FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY IF NOT EXISTS "Public insert orders_v2" ON orders_v2 FOR INSERT WITH CHECK (true);

-- order_items_v2: items within an order
CREATE TABLE IF NOT EXISTS order_items_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders_v2(id) ON DELETE CASCADE,
  part_id UUID REFERENCES parts_v2(id),
  part_name TEXT NOT NULL,
  part_number TEXT,
  brand TEXT,
  supplier_id UUID REFERENCES suppliers(id),
  quantity INTEGER DEFAULT 1,
  price NUMERIC NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_v2_order ON order_items_v2(order_id);

ALTER TABLE order_items_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Service manage order_items_v2" ON order_items_v2 FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY IF NOT EXISTS "Public insert order_items_v2" ON order_items_v2 FOR INSERT WITH CHECK (true);
