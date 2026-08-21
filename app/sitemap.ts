import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://autodelovi.sale';

const CATEGORIES = ['motor', 'kocnice', 'elektronika', 'karoserija', 'suspenzija', 'transmisija', 'ostalo'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/suppliers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/vehicle-selection`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/comparison`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  for (const slug of CATEGORIES) {
    entries.push({
      url: `${BASE_URL}/categories/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }

  try {
    const { data } = await supabase
      .from('parts_v2')
      .select('slug, updated_at')
      .eq('status', 'active')
      .not('slug', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(5000);

    if (data) {
      for (const part of data) {
        entries.push({
          url: `${BASE_URL}/parts/${part.slug}`,
          lastModified: part.updated_at ? new Date(part.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  } catch {
    // If DB unavailable, return static pages only
  }

  return entries;
}
