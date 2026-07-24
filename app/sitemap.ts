import type { MetadataRoute } from 'next';

const BASE = 'https://autodelovi.sale';

const CATEGORIES = ['motor', 'kocnice', 'elektronika', 'karoserija', 'suspenzija', 'transmisija', 'ostalo'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/marketplace`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/suppliers`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/vehicle-selection`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/comparison`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/cart`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/auth/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/auth/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(slug => ({
    url: `${BASE}/categories/${slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages];
}
