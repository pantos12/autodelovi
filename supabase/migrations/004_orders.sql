-- Orders table for storing customer checkout submissions (COD flow)
CREATE TABLE IF NOT EXISTS orders (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name    TEXT         NOT NULL,
  customer_email   TEXT         NOT NULL,
  customer_phone   TEXT         NOT NULL,
  shipping_address TEXT         NOT NULL,
  note             TEXT,
  items            JSONB        NOT NULL DEFAULT '[]',
  total_rsd        NUMERIC(12,2) NOT NULL,
  status           TEXT         NOT NULL DEFAULT 'pending',
  -- status values: pending | confirmed | shipped | delivered | cancelled
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status         ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at     ON orders(created_at DESC);

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_orders_updated_at();

-- RLS: public cannot read orders; only service_role (API) can
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_orders_all" ON orders
  FOR ALL TO service_role USING (true) WITH CHECK (true);
