-- autodelovi.sale v3.3.0 — Catalog depth, trustable stock & payable checkout
-- Adds: parts_v2, merchants, offers, fitment_claims, vin_cache, inquiries,
--        orders_v2, order_items_v2, backfill_runs

-- ─── parts_v2 ───────────────────────────────────────────────
-- Enhanced parts table that replaces v1 `parts` for all new queries.
CREATE TABLE IF NOT EXISTS parts_v2 (
  id                UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT         NOT NULL UNIQUE,
  name              TEXT         NOT NULL,
  name_sr           TEXT,
  part_number       TEXT         NOT NULL,
  oem_number        TEXT,
  brand             TEXT         NOT NULL DEFAULT '',
  category_id       TEXT         NOT NULL REFERENCES categories(id) DEFAULT 'ostalo',
  description       TEXT,
  description_sr    TEXT,
  condition         TEXT         NOT NULL DEFAULT 'new'
                                 CHECK (condition IN ('new','used','refurbished')),
  status            TEXT         NOT NULL DEFAULT 'active'
                                 CHECK (status IN ('active','out_of_stock','discontinued','pending')),
  images            TEXT[]       NOT NULL DEFAULT '{}',
  specs             JSONB        NOT NULL DEFAULT '{}',
  compatible_vehicles JSONB      NOT NULL DEFAULT '[]',
  supplier_id       TEXT         NOT NULL REFERENCES suppliers(id),
  price             NUMERIC(12,2) NOT NULL,
  price_currency    TEXT         NOT NULL DEFAULT 'RSD',
  price_eur         NUMERIC(10,2),
  stock_quantity    INT          NOT NULL DEFAULT 0,
  weight_kg         NUMERIC(8,3),
  source_url        TEXT,
  scraped_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE (part_number, supplier_id)
);

CREATE INDEX IF NOT EXISTS idx_parts_v2_fts
  ON parts_v2 USING gin(to_tsvector('simple', unaccent(name||' '||coalesce(brand,'')||' '||part_number)));
CREATE INDEX IF NOT EXISTS idx_parts_v2_category   ON parts_v2(category_id);
CREATE INDEX IF NOT EXISTS idx_parts_v2_supplier   ON parts_v2(supplier_id);
CREATE INDEX IF NOT EXISTS idx_parts_v2_status     ON parts_v2(status);
CREATE INDEX IF NOT EXISTS idx_parts_v2_price      ON parts_v2(price);
CREATE INDEX IF NOT EXISTS idx_parts_v2_updated    ON parts_v2(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_parts_v2_vehicles   ON parts_v2 USING gin(compatible_vehicles);

CREATE TRIGGER parts_v2_updated_at
  BEFORE UPDATE ON parts_v2
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE parts_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active parts_v2" ON parts_v2
  FOR SELECT USING (status IN ('active','out_of_stock'));

-- ─── merchants ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS merchants (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  homepage    TEXT,
  logo_url    TEXT,
  country     TEXT NOT NULL DEFAULT 'RS',
  trust_tier  TEXT NOT NULL DEFAULT 'retailer'
              CHECK (trust_tier IN ('retailer','warehouse','classifieds','supplier')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read merchants" ON merchants FOR SELECT USING (true);

-- ─── offers ─────────────────────────────────────────────────
-- Per-merchant stock signals for a given part.
CREATE TABLE IF NOT EXISTS offers (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id               UUID NOT NULL REFERENCES parts_v2(id) ON DELETE CASCADE,
  merchant_id           TEXT NOT NULL REFERENCES merchants(id),
  source_url            TEXT,
  price                 NUMERIC(12,2) NOT NULL,
  price_currency        TEXT NOT NULL DEFAULT 'RSD',
  price_eur             NUMERIC(10,2),
  stock_signal_strength TEXT NOT NULL DEFAULT 'weak'
                        CHECK (stock_signal_strength IN ('strong','weak','negative')),
  stock_signal_raw      TEXT,
  last_check_status     TEXT NOT NULL DEFAULT 'ok'
                        CHECK (last_check_status IN ('ok','not_found','blocked','timeout')),
  last_seen_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (part_id, merchant_id)
);

CREATE INDEX IF NOT EXISTS idx_offers_part      ON offers(part_id);
CREATE INDEX IF NOT EXISTS idx_offers_merchant   ON offers(merchant_id);
CREATE INDEX IF NOT EXISTS idx_offers_last_seen  ON offers(last_seen_at DESC);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read offers" ON offers FOR SELECT USING (true);

-- ─── fitment_claims ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fitment_claims (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id     UUID NOT NULL REFERENCES parts_v2(id) ON DELETE CASCADE,
  make        TEXT NOT NULL,
  model       TEXT,
  year_from   INT,
  year_to     INT,
  engine      TEXT,
  source      TEXT,
  confidence  NUMERIC(3,2) NOT NULL DEFAULT 0.5
              CHECK (confidence BETWEEN 0 AND 1),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fitment_part ON fitment_claims(part_id);
CREATE INDEX IF NOT EXISTS idx_fitment_make ON fitment_claims(make);

ALTER TABLE fitment_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read fitment_claims" ON fitment_claims FOR SELECT USING (true);

-- ─── vin_cache ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vin_cache (
  vin          TEXT PRIMARY KEY,
  make         TEXT,
  model        TEXT,
  model_year   INT,
  raw_payload  JSONB,
  source       TEXT NOT NULL DEFAULT 'nhtsa_vpic',
  decoded_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE vin_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read vin_cache" ON vin_cache FOR SELECT USING (true);

-- ─── inquiries ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id       UUID REFERENCES parts_v2(id) ON DELETE SET NULL,
  merchant_id   TEXT REFERENCES merchants(id) ON DELETE SET NULL,
  buyer_name    TEXT,
  buyer_email   TEXT NOT NULL,
  buyer_phone   TEXT,
  message       TEXT,
  status        TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new','pending','responded','closed')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_email  ON inquiries(buyer_email);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_inquiries_all" ON inquiries
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ─── orders_v2 ──────────────────────────────────────────────
-- Stripe-aware order table replacing legacy COD-only `orders`.
CREATE TABLE IF NOT EXISTS orders_v2 (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number      TEXT NOT NULL UNIQUE,
  buyer_email       TEXT NOT NULL,
  buyer_name        TEXT NOT NULL,
  buyer_phone       TEXT NOT NULL,
  shipping_address  TEXT NOT NULL,
  shipping_city     TEXT NOT NULL,
  shipping_postal   TEXT,
  shipping_country  TEXT NOT NULL DEFAULT 'RS',
  notes             TEXT,
  subtotal          NUMERIC(12,2) NOT NULL,
  shipping_fee      NUMERIC(12,2) NOT NULL DEFAULT 0,
  total             NUMERIC(12,2) NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'RSD',
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','paid','confirmed','shipped','delivered','cancelled','refunded')),
  payment_method    TEXT NOT NULL DEFAULT 'stripe'
                    CHECK (payment_method IN ('stripe','cod','bank_transfer')),
  stripe_session_id TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_v2_email   ON orders_v2(buyer_email);
CREATE INDEX IF NOT EXISTS idx_orders_v2_status  ON orders_v2(status);
CREATE INDEX IF NOT EXISTS idx_orders_v2_created ON orders_v2(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_v2_stripe  ON orders_v2(stripe_session_id);

CREATE TRIGGER orders_v2_updated_at
  BEFORE UPDATE ON orders_v2
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE orders_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_orders_v2_all" ON orders_v2
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ─── order_items_v2 ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items_v2 (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders_v2(id) ON DELETE CASCADE,
  part_id       UUID REFERENCES parts_v2(id) ON DELETE SET NULL,
  part_name     TEXT NOT NULL,
  part_number   TEXT,
  brand         TEXT,
  supplier_id   TEXT,
  supplier_name TEXT,
  image_url     TEXT,
  quantity      INT NOT NULL DEFAULT 1,
  unit_price    NUMERIC(12,2) NOT NULL,
  line_total    NUMERIC(12,2) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_v2_order ON order_items_v2(order_id);

ALTER TABLE order_items_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_order_items_v2_all" ON order_items_v2
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ─── backfill_runs ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS backfill_runs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source        TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'running'
                CHECK (status IN ('running','completed','failed')),
  parts_created INT NOT NULL DEFAULT 0,
  parts_updated INT NOT NULL DEFAULT 0,
  errors        TEXT[] NOT NULL DEFAULT '{}',
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ
);

ALTER TABLE backfill_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_backfill_all" ON backfill_runs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ─── Update search_parts RPC to use parts_v2 ────────────────
CREATE OR REPLACE FUNCTION search_parts(
  query TEXT,
  category_filter TEXT DEFAULT NULL,
  min_price_filter NUMERIC DEFAULT NULL,
  max_price_filter NUMERIC DEFAULT NULL,
  in_stock_filter BOOLEAN DEFAULT NULL,
  page_num INT DEFAULT 1,
  page_size INT DEFAULT 24
)
RETURNS TABLE(
  id UUID, slug TEXT, name TEXT, brand TEXT, part_number TEXT,
  price NUMERIC, price_eur NUMERIC, stock_quantity INT,
  category_id TEXT, supplier_id TEXT, images TEXT[],
  scraped_at TIMESTAMPTZ,
  rank REAL, total_count BIGINT
)
LANGUAGE plpgsql AS $$
DECLARE
  offset_val INT := (page_num - 1) * page_size;
  tsq TSQUERY;
BEGIN
  BEGIN
    tsq := to_tsquery('simple', unaccent(regexp_replace(trim(query),'\s+',':* & ','g')||':*'));
  EXCEPTION WHEN OTHERS THEN
    tsq := to_tsquery('simple','parts');
  END;
  RETURN QUERY
    SELECT p.id, p.slug, p.name, p.brand, p.part_number, p.price, p.price_eur,
           p.stock_quantity, p.category_id, p.supplier_id, p.images,
           p.scraped_at,
           ts_rank(to_tsvector('simple', unaccent(p.name||' '||p.brand||' '||p.part_number)), tsq) AS rank,
           count(*) OVER() AS total_count
    FROM parts_v2 p
    WHERE p.status IN ('active','out_of_stock')
      AND to_tsvector('simple', unaccent(p.name||' '||p.brand||' '||p.part_number)) @@ tsq
      AND (category_filter IS NULL OR p.category_id = category_filter)
      AND (min_price_filter IS NULL OR p.price >= min_price_filter)
      AND (max_price_filter IS NULL OR p.price <= max_price_filter)
      AND (in_stock_filter IS NULL OR (in_stock_filter = TRUE AND p.stock_quantity > 0) OR in_stock_filter = FALSE)
    ORDER BY rank DESC, p.updated_at DESC
    LIMIT page_size OFFSET offset_val;
END;
$$;
