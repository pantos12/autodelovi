-- Backfill existing compatible_vehicles rows to include engine field
UPDATE parts_v2
SET compatible_vehicles = (
  SELECT jsonb_agg(elem || '{"engine": null}'::jsonb)
  FROM jsonb_array_elements(compatible_vehicles) AS elem
)
WHERE compatible_vehicles IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM jsonb_array_elements(compatible_vehicles) AS el WHERE el ? 'engine'
  );

-- GIN index for fast JSONB filtering on compatible_vehicles
CREATE INDEX IF NOT EXISTS idx_parts_v2_compatible_vehicles
ON parts_v2 USING GIN (compatible_vehicles);

-- RPC: filter parts by vehicle (make, model, year, engine, category)
CREATE OR REPLACE FUNCTION search_parts_by_vehicle(
  p_make     TEXT    DEFAULT NULL,
  p_model    TEXT    DEFAULT NULL,
  p_year     INT     DEFAULT NULL,
  p_engine   TEXT    DEFAULT NULL,
  p_category TEXT    DEFAULT NULL,
  p_limit    INT     DEFAULT 20,
  p_offset   INT     DEFAULT 0
)
RETURNS TABLE (
  id                UUID,
  slug              TEXT,
  name              TEXT,
  name_sr           TEXT,
  brand             TEXT,
  category_id       TEXT,
  price             NUMERIC,
  price_currency    TEXT,
  stock_quantity    INT,
  images            TEXT[],
  compatible_vehicles JSONB,
  supplier_id       TEXT,
  part_number       TEXT,
  specs             JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id, p.slug, p.name, p.name_sr, p.brand,
    p.category_id, p.price, p.price_currency,
    p.stock_quantity, p.images, p.compatible_vehicles,
    p.supplier_id, p.part_number, p.specs
  FROM parts_v2 p
  WHERE
    p.status = 'active'
    AND (p_category IS NULL OR p.category_id = p_category)
    AND (
      -- No vehicle filter → show everything
      (p_make IS NULL AND p_model IS NULL AND p_year IS NULL)
      OR
      -- Vehicle filter → check JSONB compatibility array
      EXISTS (
        SELECT 1 FROM jsonb_array_elements(p.compatible_vehicles) AS v
        WHERE
          (p_make   IS NULL OR (v->>'make')  ILIKE p_make)
          AND (p_model  IS NULL OR (v->>'model') ILIKE p_model)
          AND (p_year   IS NULL OR (
                (v->>'year_from')::int <= p_year
                AND (v->>'year_to')::int   >= p_year
              ))
          AND (p_engine IS NULL OR v->>'engine' IS NULL OR (v->>'engine') ILIKE p_engine)
      )
    )
  ORDER BY p.price ASC
  LIMIT  p_limit
  OFFSET p_offset;
END;
$$;
