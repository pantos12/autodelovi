-- Performance indexes for common query patterns
-- Marketplace listing with filters
CREATE INDEX IF NOT EXISTS idx_parts_v2_status_category
  ON parts_v2 (status, category_id);

CREATE INDEX IF NOT EXISTS idx_parts_v2_status_supplier
  ON parts_v2 (status, supplier_id);

CREATE INDEX IF NOT EXISTS idx_parts_v2_active_price
  ON parts_v2 (price)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_parts_v2_active_stock
  ON parts_v2 (stock_quantity)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_parts_v2_active_created
  ON parts_v2 (created_at DESC)
  WHERE status = 'active';

-- JSONB vehicle compatibility queries
CREATE INDEX IF NOT EXISTS idx_parts_v2_vehicles
  ON parts_v2 USING GIN (compatible_vehicles);

-- Full-text search fallback (ilike queries)
CREATE INDEX IF NOT EXISTS idx_parts_v2_name_trgm
  ON parts_v2 USING GIN (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_parts_v2_brand_trgm
  ON parts_v2 USING GIN (brand gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_parts_v2_part_number_trgm
  ON parts_v2 USING GIN (part_number gin_trgm_ops);

-- Price history lookups
CREATE INDEX IF NOT EXISTS idx_price_history_part_date
  ON price_history (part_id, recorded_at DESC);

-- Offers by merchant
CREATE INDEX IF NOT EXISTS idx_offers_merchant
  ON offers (merchant_id);

CREATE INDEX IF NOT EXISTS idx_offers_part
  ON offers (part_id);

-- Inquiries by status for admin views
CREATE INDEX IF NOT EXISTS idx_inquiries_status
  ON inquiries (status, created_at DESC);
