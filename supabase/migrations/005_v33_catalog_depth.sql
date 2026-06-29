-- v3.3.0 — Catalog depth: merchants, offers, fitment, VIN cache, inquiries, backfill tracking

-- Merchants (scraped supplier sources)
CREATE TABLE IF NOT EXISTS merchants (
  id         TEXT        PRIMARY KEY,
  slug       TEXT        NOT NULL UNIQUE,
  name       TEXT        NOT NULL,
  homepage   TEXT,
  logo_url   TEXT,
  country    TEXT        NOT NULL DEFAULT 'RS',
  trust_tier TEXT        NOT NULL DEFAULT 'supplier'
    CHECK (trust_tier IN ('retailer','warehouse','classifieds','supplier')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO merchants (id, slug, name, homepage, country, trust_tier) VALUES
  ('autohub',             'autohub',             'AutoHub.rs',              'https://autohub.rs',              'RS', 'retailer'),
  ('prodajadelova',       'prodajadelova',       'ProdajaDelova.rs',        'https://prodajadelova.rs',        'RS', 'retailer'),
  ('delovionline',        'delovionline',        'DeloviOnline.rs',         'https://delovionline.rs',         'RS', 'retailer'),
  ('alvadi',              'alvadi',              'ALVADI Serbia',           'https://alvadi.rs',               'RS', 'warehouse'),
  ('polovniautomobili',   'polovniautomobili',   'PolovniAutomobili.com',   'https://polovniautomobili.com',   'RS', 'classifieds')
ON CONFLICT (id) DO NOTHING;

-- Offers (per-merchant stock signals)
CREATE TABLE IF NOT EXISTS offers (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id               UUID        NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
  merchant_id           TEXT        NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  source_url            TEXT,
  price                 NUMERIC(12,2) NOT NULL,
  price_currency        TEXT        NOT NULL DEFAULT 'RSD',
  price_eur             NUMERIC(10,2),
  stock_signal_strength TEXT        NOT NULL DEFAULT 'weak'
    CHECK (stock_signal_strength IN ('strong','weak','negative')),
  stock_signal_raw      TEXT,
  last_check_status     TEXT        NOT NULL DEFAULT 'ok'
    CHECK (last_check_status IN ('ok','not_found','blocked','timeout')),
  last_seen_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (part_id, merchant_id)
);

CREATE INDEX IF NOT EXISTS idx_offers_part_id     ON offers(part_id);
CREATE INDEX IF NOT EXISTS idx_offers_merchant_id  ON offers(merchant_id);
CREATE INDEX IF NOT EXISTS idx_offers_last_seen    ON offers(last_seen_at DESC);

-- Fitment claims (vehicle compatibility from scraped data)
CREATE TABLE IF NOT EXISTS fitment_claims (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id    UUID        NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
  make       TEXT        NOT NULL,
  model      TEXT,
  year_from  INT,
  year_to    INT,
  engine     TEXT,
  source     TEXT,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.5
    CHECK (confidence BETWEEN 0 AND 1)
);

CREATE INDEX IF NOT EXISTS idx_fitment_part_id ON fitment_claims(part_id);
CREATE INDEX IF NOT EXISTS idx_fitment_make    ON fitment_claims(make);

-- VIN decode cache
CREATE TABLE IF NOT EXISTS vin_cache (
  vin         TEXT        PRIMARY KEY,
  make        TEXT,
  model       TEXT,
  model_year  INT,
  raw_payload JSONB,
  source      TEXT        NOT NULL DEFAULT 'nhtsa_vpic',
  decoded_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Inquiries (buyer-to-merchant contact for red-band parts)
CREATE TABLE IF NOT EXISTS inquiries (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id      UUID        REFERENCES parts(id) ON DELETE SET NULL,
  merchant_id  TEXT        REFERENCES merchants(id) ON DELETE SET NULL,
  buyer_name   TEXT,
  buyer_email  TEXT        NOT NULL,
  buyer_phone  TEXT,
  message      TEXT,
  status       TEXT        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','responded','closed')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_part_id ON inquiries(part_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status  ON inquiries(status);

-- Backfill run tracking
CREATE TABLE IF NOT EXISTS backfill_runs (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id      TEXT        NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'running'
    CHECK (status IN ('running','completed','failed')),
  parts_fetched    INT         NOT NULL DEFAULT 0,
  parts_normalized INT         NOT NULL DEFAULT 0,
  parts_upserted   INT         NOT NULL DEFAULT 0,
  errors           TEXT[]      NOT NULL DEFAULT '{}',
  flags            JSONB       NOT NULL DEFAULT '{}',
  started_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_backfill_supplier ON backfill_runs(supplier_id);

-- v3.3 checkout tables (Stripe flow)
CREATE TABLE IF NOT EXISTS orders_v2 (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number      TEXT         NOT NULL UNIQUE,
  buyer_name        TEXT         NOT NULL,
  buyer_email       TEXT         NOT NULL,
  buyer_phone       TEXT         NOT NULL,
  buyer_address     TEXT         NOT NULL,
  buyer_city        TEXT         NOT NULL,
  buyer_postal      TEXT,
  buyer_notes       TEXT,
  subtotal          NUMERIC(12,2) NOT NULL,
  shipping_fee      NUMERIC(12,2) NOT NULL DEFAULT 0,
  total             NUMERIC(12,2) NOT NULL,
  currency          TEXT         NOT NULL DEFAULT 'RSD',
  status            TEXT         NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','cancelled','shipped','delivered')),
  stripe_session_id TEXT,
  payment_method    TEXT,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_v2_email  ON orders_v2(buyer_email);
CREATE INDEX IF NOT EXISTS idx_orders_v2_status ON orders_v2(status);
CREATE INDEX IF NOT EXISTS idx_orders_v2_stripe ON orders_v2(stripe_session_id);

CREATE TABLE IF NOT EXISTS order_items_v2 (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID         NOT NULL REFERENCES orders_v2(id) ON DELETE CASCADE,
  part_id    UUID,
  part_name  TEXT         NOT NULL,
  supplier_id TEXT,
  image_url  TEXT,
  quantity   INT          NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_v2_order ON order_items_v2(order_id);

-- RLS policies
ALTER TABLE merchants     ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitment_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE vin_cache     ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE backfill_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders_v2     ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_merchants" ON merchants FOR SELECT USING (true);
CREATE POLICY "public_read_offers"    ON offers    FOR SELECT USING (true);
CREATE POLICY "public_read_fitment"   ON fitment_claims FOR SELECT USING (true);

CREATE POLICY "service_role_merchants_all"  ON merchants     FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_offers_all"     ON offers        FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_fitment_all"    ON fitment_claims FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_vin_cache_all"  ON vin_cache     FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_inquiries_all"  ON inquiries     FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_backfill_all"   ON backfill_runs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_orders_v2_all"  ON orders_v2     FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_order_items_all" ON order_items_v2 FOR ALL TO service_role USING (true) WITH CHECK (true);
