import { createClient } from '@supabase/supabase-js';
import type { Part, Category, Supplier, PriceRecord, ScrapingJob, NormalizedPart, PriceAlert } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

const isConfigured = () => !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function getParts(params: {
  q?: string; category?: string; make?: string; model?: string; year?: number;
  supplier?: string; min_price?: number; max_price?: number;
  in_stock?: boolean; sort?: string; page?: number; per_page?: number;
} = {}) {
  if (!isConfigured()) {
    // Supabase not set up yet â return empty results
    return { parts: [] as Part[], total: 0, page: params.page ?? 1, per_page: params.per_page ?? 24, total_pages: 0 };
  }

  const { q, category, make, model, year, supplier, min_price, max_price,
    in_stock, sort = 'newest', page = 1, per_page = 24 } = params;

  let query = supabase
    .from('parts')
    .select(`*, category:categories(*), supplier:suppliers(id,name,slug,city,is_verified,logo_url)`, { count: 'exact' })
    .eq('status', 'active');

  if (q) {
    const safeQ = q.replace(/[%_\\'"(),.]/g, '').slice(0, 100);
    if (safeQ.length >= 2) {
      const p = `%${safeQ}%`;
      query = query.or(`name.ilike.${p},name_sr.ilike.${p},part_number.ilike.${p},oem_number.ilike.${p},brand.ilike.${p}`);
    }
  }
  if (category) query = query.eq('category_id', category);
  if (supplier) query = query.eq('supplier_id', supplier);
  if (min_price !== undefined) query = query.gte('price', min_price);
  if (max_price !== undefined) query = query.lte('price', max_price);
  if (in_stock) query = query.gt('stock_quantity', 0);
  if (make) {
    const safeMake = make.replace(/[%_\\'"(),.]/g, '').slice(0, 50);
    if (safeMake.length > 0) {
      // Match either JSONB compatible_vehicles OR text in name/brand (scrapers often don't populate JSONB)
      const p = `%${safeMake}%`;
      query = query.or(
        `compatible_vehicles.cs.[{"make":"${safeMake}"}],name.ilike.${p},name_sr.ilike.${p},brand.ilike.${p},description.ilike.${p}`
      );
    }
  }

  switch (sort) {
    case 'price_asc':  query = query.order('price', { ascending: true }); break;
    case 'price_desc': query = query.order('price', { ascending: false }); break;
    case 'name_asc':   query = query.order('name', { ascending: true }); break;
    default:           query = query.order('created_at', { ascending: false }); break;
  }

  const from = (page - 1) * per_page;
  query = query.range(from, from + per_page - 1);
  const { data, error, count } = await query;
  if (error) throw error;
  return { parts: data as Part[], total: count ?? 0, page, per_page, total_pages: Math.ceil((count ?? 0) / per_page) };
}
export async function getPartById(id: string): Promise<Part | null> {
  if (!isConfigured()) return null;
  const { data, error } = await supabase.from('parts').select(`*, category:categories(*), supplier:suppliers(*)`).eq('id', id).single();
  if (error) return null;
  return data as Part;
}

export async function getPartBySlug(slug: string): Promise<Part | null> {
  if (!isConfigured()) return null;
  const { data, error } = await supabase.from('parts').select(`*, category:categories(*), supplier:suppliers(*)`).eq('slug', slug).single();
  if (error) return null;
  return data as Part;
}

export async function getRelatedParts(part: Part, limit = 4): Promise<Part[]> {
  if (!isConfigured()) return [];
  const { data } = await supabase.from('parts').select(`*, supplier:suppliers(id,name,slug,city,is_verified)`).eq('category_id', part.category_id).neq('id', part.id).eq('status', 'active').limit(limit);
  return (data ?? []) as Part[];
}

export async function upsertPart(part: Partial<Part>): Promise<Part> {
  const { data, error } = await supabaseAdmin.from('parts').upsert(part, { onConflict: 'part_number,supplier_id', ignoreDuplicates: false }).select().single();
  if (error) throw error;
  return data as Part;
}

export async function recordPriceHistory(partId: string, supplierId: string, price: number, priceEur: number, currency: string): Promise<void> {
  const { error } = await supabaseAdmin.from('price_history').insert({ part_id: partId, supplier_id: supplierId, price, price_eur: priceEur, currency, source: 'scrape', recorded_at: new Date().toISOString() });
  if (error) throw error;
}

export async function getPriceHistory(partId: string, days = 30): Promise<PriceRecord[]> {
  if (!isConfigured()) return [];
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data } = await supabase.from('price_history').select('*').eq('part_id', partId).gte('recorded_at', since).order('recorded_at', { ascending: true });
  return (data ?? []) as PriceRecord[];
}

export async function detectPriceChanges(parts: Array<{ id: string; price: number; part_number: string; supplier_id: string }>): Promise<PriceAlert[]> {
  if (!isConfigured()) return [];
  const alerts: PriceAlert[] = [];
  for (const part of parts) {
    const { data: latest } = await supabase.from('price_history').select('price').eq('part_id', part.id).order('recorded_at', { ascending: false }).limit(1).single();
    if (latest && Math.abs(latest.price - part.price) / latest.price > 0.05) {
      const { data: pf } = await supabase.from('parts').select('name, supplier:suppliers(name)').eq('id', part.id).single();
      alerts.push({ part_id: part.id, part_name: (pf as any)?.name ?? part.part_number, old_price: latest.price, new_price: part.price, change_pct: ((part.price - latest.price) / latest.price) * 100, supplier_name: (pf as any)?.supplier?.name ?? '', currency: 'RSD' });
    }
  }
  return alerts;
}

export async function getCategories(): Promise<Category[]> {
  if (!isConfigured()) return [];
  const { data } = await supabase.from('categories').select('*, part_count:parts(count)').order('sort_order', { ascending: true });
  return (data ?? []) as Category[];
}

export async function getSuppliers(activeOnly = true): Promise<Supplier[]> {
  if (!isConfigured()) return [];
  let query = supabase.from('suppliers').select('*').order('name');
  if (activeOnly) query = query.eq('status', 'active');
  const { data } = await query;
  return (data ?? []) as Supplier[];
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  if (!isConfigured()) return null;
  const { data } = await supabase.from('suppliers').select('*').eq('id', id).single();
  return data as Supplier | null;
}


export async function createScrapingJob(
  supplierId: string,
  triggeredBy: 'cron' | 'manual' | 'api'
): Promise<ScrapingJob> {
  if (!isConfigured()) {
    return {
      id: crypto.randomUUID(),
      supplier_id: supplierId,
      status: 'running',
      started_at: new Date().toISOString(),
      parts_found: 0,
      parts_upserted: 0,
      parts_skipped: 0,
      errors: [],
      triggered_by: triggeredBy,
    } as ScrapingJob;
  }
  const { data, error } = await supabaseAdmin
    .from('scraping_jobs')
    .insert({
      supplier_id: supplierId,
      status: 'running',
      started_at: new Date().toISOString(),
      parts_found: 0,
      parts_upserted: 0,
      parts_skipped: 0,
      errors: [],
      triggered_by: triggeredBy,
    })
    .select()
    .single();
  if (error) throw error;
  return data as ScrapingJob;
}

export async function updateScrapingJob(
  jobId: string,
  updates: Partial<ScrapingJob>
): Promise<void> {
  if (!isConfigured()) return;
  const { error } = await supabaseAdmin
    .from('scraping_jobs')
    .update(updates)
    .eq('id', jobId);
  if (error) throw error;
}

export async function getRecentJobs(limit = 20): Promise<ScrapingJob[]> {
  if (!isConfigured()) return [];
  const { data, error } = await supabase
    .from('scraping_jobs')
    .select('*, supplier:suppliers(name, slug)')
    .order('started_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ScrapingJob[];
}
