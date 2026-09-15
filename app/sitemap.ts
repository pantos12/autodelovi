import type { MetadataRoute } from 'next';
import { getParts, getCategories } from '@/lib/supabase';

const BASE = 'https://autodelovi.sale';

const STATIC_CATEGORIES = [
  'motor', 'kocnice', 'elektronika', 'karoserija',
  'suspenzija', 'transmisija', 'ostalo',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/suppliers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/vehicle-selection`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/comparison`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  for (const slug of STATIC_CATEGORIES) {
    entries.push({
      url: `${BASE}/categories/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }

  try {
    const { parts } = await getParts({ per_page: 500 });
    for (const part of parts) {
      entries.push({
        url: `${BASE}/parts/${part.slug || part.id}`,
        lastModified: part.updated_at ? new Date(part.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  } catch {}

  return entries;
}
