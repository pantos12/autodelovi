import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE = 'https://autodelovi.sale';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/suppliers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/vehicle-selection`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/comparison`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  let partPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];

  try {
    const { data: parts } = await supabase
      .from('parts')
      .select('slug, updated_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(5000);

    if (parts) {
      partPages = parts.map(p => ({
        url: `${BASE}/parts/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }

    const { data: categories } = await supabase
      .from('categories')
      .select('slug');

    if (categories) {
      categoryPages = categories.map(c => ({
        url: `${BASE}/categories/${c.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Supabase not configured — return static pages only
  }

  return [...staticPages, ...partPages, ...categoryPages];
}
