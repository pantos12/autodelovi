import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://autodelovi.sale';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/marketplace`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/suppliers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/vehicle-selection`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/comparison`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categories = ['motor', 'kocnice', 'elektronika', 'karoserija', 'suspenzija', 'transmisija', 'ostalo'];
  const categoryPages: MetadataRoute.Sitemap = categories.map(slug => ({
    url: `${base}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages];
}
