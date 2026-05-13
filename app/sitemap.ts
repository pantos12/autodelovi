import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://autodelovi.sale';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/suppliers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/comparison`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/vehicle-selection`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const categories = ['motor', 'kocnice', 'elektronika', 'karoserija', 'suspenzija', 'transmisija', 'ostalo'];
  const categoryPages: MetadataRoute.Sitemap = categories.map(slug => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  let partPages: MetadataRoute.Sitemap = [];
  try {
    const { data: parts } = await supabase
      .from('parts_v2')
      .select('slug, id, updated_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(5000);

    if (parts) {
      partPages = parts.map(p => ({
        url: `${baseUrl}/parts/${p.slug || p.id}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Supabase not configured — return static pages only
  }

  return [...staticPages, ...categoryPages, ...partPages];
}
