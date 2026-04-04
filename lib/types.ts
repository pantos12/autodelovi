// ============================================================
// autodelovi.sale — Shared TypeScript Types
// ============================================================

export type PartCondition = 'new' | 'used' | 'refurbished';
export type PartStatus = 'active' | 'out_of_stock' | 'discontinued' | 'pending';
export type SupplierStatus = 'active' | 'inactive' | 'pending_review';
export type ScrapingJobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'partial';

// ─── Core Part ───────────────────────────────────────────────
export interface Part {
  id: string;
  slug: string;
  name: string;
  name_sr?: string;
  part_number: string;
  oem_number?: string;
  brand: string;
  category_id: string;
  category?: Category;
  description?: string;
  description_sr?: string;
  condition: PartCondition;
  status: PartStatus;
  images: string[];
  specs: Record<string, string | number>;
  compatible_vehicles: CompatibleVehicle[];
  supplier_id: string;
  supplier?: Supplier;
  price: number;
  price_currency: string;
  price_eur?: number;
  stock_quantity: number;
  weight_kg?: number;
  source_url?: string;
  scraped_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  name_sr: string;
  parent_id?: string;
  parent?: Category;
  icon?: string;
  sort_order: number;
  part_count?: number;
}

export interface Supplier {
  id: string;
  slug: string;
  name: string;
  logo_url?: string;
  website?: string;
  email?: string;
  phone?: string;
  city: string;
  address?: string;
  description?: string;
  description_sr?: string;
  is_verified: boolean;
  status: SupplierStatus;
  rating: number;
  review_count: number;
  scrape_url?: string;
  scrape_config?: ScrapeConfig;
  created_at: string;
  updated_at: string;
}

export interface CompatibleVehicle {
  make: string;
  model: string;
  year_from: number;
  year_to?: number;
  engine?: string;
  body_type?: string;
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  engine?: string;
  body_type?: string;
}

export interface PriceRecord {
  id: string;
  part_id: string;
  supplier_id: string;
  price: number;
  price_eur?: number;
  currency: string;
  recorded_at: string;
  source: 'scrape' | 'manual' | 'api';
}

export interface ScrapeConfig {
  type: 'html' | 'api' | 'sitemap';
  base_url: string;
  list_selector?: string;
  item_selector?: string;
  field_map?: Record<string, string>;
  pagination?: {
    type: 'page_number' | 'offset' | 'cursor';
    param: string;
    max_pages?: number;
  };
  rate_limit_ms?: number;
  headers?: Record<string, string>;
}

export interface ScrapedPart {
  raw_name: string;
  raw_price: string;
  part_number?: string;
  oem_number?: string;
  brand?: string;
  category_hint?: string;
  description?: string;
  image_urls?: string[];
  product_url?: string;
  stock?: string;
  supplier_id: string;
  scraped_at: string;
}

export interface NormalizedPart extends ScrapedPart {
  name: string;
  price: number;
  price_currency: string;
  price_eur: number;
  category_id?: string;
  condition: PartCondition;
  specs: Record<string, string>;
  compatible_vehicles: CompatibleVehicle[];
  confidence: number;
}

export interface ScrapingJob {
  id: string;
  supplier_id: string;
  status: ScrapingJobStatus;
  started_at: string;
  completed_at?: string;
  parts_found: number;
  parts_upserted: number;
  parts_skipped: number;
  errors: string[];
  triggered_by: 'cron' | 'manual' | 'api';
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface PartsQueryParams {
  q?: string;
  category?: string;
  make?: string;
  model?: string;
  year?: number;
  engine?: string;
  supplier?: string;
  min_price?: number;
  max_price?: number;
  condition?: PartCondition;
  in_stock?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'newest' | 'relevance';
  page?: number;
  per_page?: number;
}

export interface PipelineResult {
  job_id: string;
  supplier_id: string;
  scrape_result: {
    parts_fetched: number;
    duration_ms: number;
    errors: string[];
  };
  normalize_result: {
    parts_normalized: number;
    parts_rejected: number;
    duration_ms: number;
  };
  db_result: {
    upserted: number;
    skipped: number;
    price_changes: number;
    duration_ms: number;
  };
  total_duration_ms: number;
  status: ScrapingJobStatus;
}

export interface PriceAlert {
  part_id: string;
  part_name: string;
  old_price: number;
  new_price: number;
  change_pct: number;
  supplier_name: string;
  currency: string;
}
