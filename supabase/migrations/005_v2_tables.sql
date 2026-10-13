-- Migration 005: Create v2 tables referenced by application code but missing from migrations.
-- parts_v2 mirrors parts (001) with identical DDL; orders_v2 + order_items_v2 replace legacy orders.
-- Also: carts/cart_items, merchants, offers, fitment_claims, vin_cache, inquiries, backfill_runs.

-- ─── parts_v2 ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parts_v2 (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          text UNIQUE,
  name          text NOT NULL,
  name_sr       text,
  part_number   text,
  oem_number    text,
  brand         text,
  category_id   text REFERENCES categories(id),
  description   text,
  description_sr text,
  condition     text DEFAULT 'new',
  status        text DEFAULT 'active',
  images        text[],
  specs         jsonb DEFAULT '{}',
  compatible_vehicles jsonb DEFAULT '[]',
  supplier_id   text REFERENCES suppliers(id),
  price         numeric(12,2),
  price_currency text DEFAULT 'RSD',
  price_eur     numeric(12,2),
  stock_quantity integer DEFAULT 0,
  weight_kg     numeric(8,3),
  source_url    text,
  scraped_at    timestamptz,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),
  UNIQUE(part_number, supplier_id)
);

CREATE INDEX IF NOT EXISTS idx_parts_v2_category ON parts_v2(category_id);
CREATE INDEX IF NOT EXISTS idx_parts_v2_supplier ON parts_v2(supplier_id);
CREATE INDEX IF NOT EXISTS idx_parts_v2_status ON parts_v2(status);
CREATE INDEX IF NOT EXISTS idx_parts_v2_brand ON parts_v2(brand);
CREATE INDEX IF NOT EXISTS idx_parts_v2_compatible_vehicles ON parts_v2 USING gin(compatible_vehicles);

ALTER TABLE parts_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parts_v2_public_read" ON parts_v2 FOR SELECT USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_parts_v2_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_parts_v2_updated_at ON parts_v2;
CREATE TRIGGER trg_parts_v2_updated_at
  BEFORE UPDATE ON parts_v2
  FOR EACH ROW EXECUTE FUNCTION update_parts_v2_updated_at();

-- ─── merchants ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS merchants (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  homepage    text,
  logo_url    text,
  country     text DEFAULT 'RS',
  trust_tier  text DEFAULT 'retailer'
    CHECK (trust_tier IN ('retailer','warehouse','classifieds','supplier')),
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "merchants_public_read" ON merchants FOR SELECT USING (true);

-- ─── offers ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS offers (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id               uuid NOT NULL REFERENCES parts_v2(id) ON DELETE CASCADE,
  merchant_id           uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  source_url            text,
  price                 numeric(12,2),
  price_currency        text DEFAULT 'RSD',
  price_eur             numeric(12,2),
  stock_signal_strength numeric(5,2) DEFAULT 0,
  stock_signal_raw      text,
  last_check_status     text,
  last_seen_at          timestamptz,
  created_at            timestamptz DEFAULT now(),
  UNIQUE(part_id, merchant_id)
);

CREATE INDEX IF NOT EXISTS idx_offers_part ON offers(part_id);
CREATE INDEX IF NOT EXISTS idx_offers_merchant ON offers(merchant_id);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "offers_public_read" ON offers FOR SELECT USING (true);

-- ─── fitment_claims ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fitment_claims (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id     uuid NOT NULL REFERENCES parts_v2(id) ON DELETE CASCADE,
  make        text NOT NULL,
  model       text,
  year_from   integer,
  year_to     integer,
  engine      text,
  source      text,
  confidence  numeric(3,2) DEFAULT 0.5,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fitment_part ON fitment_claims(part_id);
CREATE INDEX IF NOT EXISTS idx_fitment_make_model ON fitment_claims(make, model);

ALTER TABLE fitment_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fitment_public_read" ON fitment_claims FOR SELECT USING (true);

-- ─── vin_cache ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vin_cache (
  vin         text PRIMARY KEY,
  make        text,
  model       text,
  model_year  text,
  raw_payload jsonb,
  source      text DEFAULT 'nhtsa',
  decoded_at  timestamptz DEFAULT now()
);

ALTER TABLE vin_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vin_cache_public_read" ON vin_cache FOR SELECT USING (true);

-- ─── inquiries ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id      text,
  merchant_id  text,
  buyer_name   text,
  buyer_email  text NOT NULL,
  buyer_phone  text,
  message      text,
  status       text DEFAULT 'new'
    CHECK (status IN ('new','pending','responded','closed')),
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inquiries_service_only" ON inquiries
  FOR ALL USING (auth.role() = 'service_role');

-- ─── backfill_runs ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS backfill_runs (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  source          text NOT NULL,
  started_at      timestamptz DEFAULT now(),
  finished_at     timestamptz,
  status          text DEFAULT 'running'
    CHECK (status IN ('running','success','failed','partial')),
  parts_found     integer DEFAULT 0,
  parts_upserted  integer DEFAULT 0,
  parts_skipped   integer DEFAULT 0,
  errors          jsonb DEFAULT '[]',
  checkpoint      jsonb DEFAULT '{}',
  flags           jsonb DEFAULT '{}'
);

ALTER TABLE backfill_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "backfill_runs_service_only" ON backfill_runs
  FOR ALL USING (auth.role() = 'service_role');

-- ─── orders_v2 ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders_v2 (
  id                      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number            text UNIQUE NOT NULL,
  status                  text DEFAULT 'pending'
    CHECK (status IN ('pending','paid','cancelled','refunded')),
  buyer_email             text NOT NULL,
  buyer_name              text NOT NULL,
  buyer_phone             text,
  shipping_address        text,
  shipping_city           text,
  shipping_postal         text,
  shipping_country        text DEFAULT 'RS',
  notes                   text,
  subtotal                numeric(12,2) NOT NULL,
  shipping_fee            numeric(12,2) DEFAULT 0,
  total                   numeric(12,2) NOT NULL,
  currency                text DEFAULT 'RSD',
  payment_method          text DEFAULT 'stripe',
  stripe_session_id       text,
  stripe_payment_intent_id text,
  paid_at                 timestamptz,
  created_at              timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_v2_email ON orders_v2(buyer_email);
CREATE INDEX IF NOT EXISTS idx_orders_v2_stripe_session ON orders_v2(stripe_session_id);

ALTER TABLE orders_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_v2_service_only" ON orders_v2
  FOR ALL USING (auth.role() = 'service_role');

-- ─── order_items_v2 ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items_v2 (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      uuid NOT NULL REFERENCES orders_v2(id) ON DELETE CASCADE,
  part_id       text,
  part_name     text NOT NULL,
  part_number   text,
  brand         text,
  supplier_id   text,
  supplier_name text,
  image_url     text,
  quantity      integer NOT NULL DEFAULT 1,
  unit_price    numeric(12,2) NOT NULL,
  line_total    numeric(12,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_v2_order ON order_items_v2(order_id);

ALTER TABLE order_items_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_v2_service_only" ON order_items_v2
  FOR ALL USING (auth.role() = 'service_role');

-- ─── carts ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS carts (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  text UNIQUE NOT NULL,
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "carts_service_only" ON carts
  FOR ALL USING (auth.role() = 'service_role');

-- ─── cart_items ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id        uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  part_id        text NOT NULL,
  quantity       integer NOT NULL DEFAULT 1,
  name           text,
  brand          text,
  price          numeric(12,2),
  price_currency text DEFAULT 'RSD',
  image_url      text,
  supplier_id    text,
  supplier_name  text,
  part_number    text
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cart_items_service_only" ON cart_items
  FOR ALL USING (auth.role() = 'service_role');

-- ─── Update search_parts() to reference parts_v2 ──────────────────────────────
CREATE OR REPLACE FUNCTION search_parts(search_query text)
RETURNS SETOF parts_v2
LANGUAGE sql STABLE
AS $$
  SELECT *
  FROM parts_v2 p
  WHERE p.status = 'active'
    AND (
      to_tsvector('simple', coalesce(p.name,'') || ' ' || coalesce(p.name_sr,'') || ' ' || coalesce(p.part_number,'') || ' ' || coalesce(p.oem_number,'') || ' ' || coalesce(p.brand,''))
      @@ plainto_tsquery('simple', search_query)
    )
  ORDER BY ts_rank(
    to_tsvector('simple', coalesce(p.name,'') || ' ' || coalesce(p.name_sr,'') || ' ' || coalesce(p.part_number,'') || ' ' || coalesce(p.oem_number,'') || ' ' || coalesce(p.brand,'')),
    plainto_tsquery('simple', search_query)
  ) DESC
  LIMIT 50;
$$;
