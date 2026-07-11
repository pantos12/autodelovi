import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://autodelovi.sale';
  const now = new Date().toISOString();

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/marketplace`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/vehicle-selection`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/suppliers`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/categories/motor`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/categories/kocnice`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/categories/elektronika`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/categories/karoserija`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/comparison`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
