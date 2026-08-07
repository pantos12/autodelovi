import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://autodelovi.sale';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/suppliers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/comparison`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${base}/vehicle-selection`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const categories = ['motor', 'kocnice', 'elektronika', 'karoserija', 'suspenzija', 'transmisija', 'ostalo'];
  const categoryPages: MetadataRoute.Sitemap = categories.map(slug => ({
    url: `${base}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  let partPages: MetadataRoute.Sitemap = [];
  try {
    const { data: parts } = await supabase
      .from('parts_v2')
      .select('slug, updated_at')
      .in('status', ['active', 'out_of_stock'])
      .order('updated_at', { ascending: false })
      .limit(5000);

    if (parts) {
      partPages = parts.map(p => ({
        url: `${base}/parts/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch {}

  return [...staticPages, ...categoryPages, ...partPages];
}
