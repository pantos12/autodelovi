import type { MetadataRoute } from 'next';

const CATEGORIES = ['motor', 'kocnice', 'elektronika', 'karoserija', 'suspenzija', 'transmisija', 'ostalo'];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://autodelovi.sale';
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/marketplace`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/suppliers`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/vehicle-selection`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/comparison`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(slug => ({
    url: `${base}/categories/${slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages];
}
