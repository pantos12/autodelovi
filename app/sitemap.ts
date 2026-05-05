import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://autodelovi.sale';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/marketplace`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/suppliers`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/vehicle-selection`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/comparison`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categories = ['motor', 'kocnice', 'elektronika', 'karoserija', 'suspenzija', 'transmisija', 'ostalo'];
  const categoryPages: MetadataRoute.Sitemap = categories.map(slug => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages];
}
