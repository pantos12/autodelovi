import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://autodelovi.sale';

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/marketplace`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/suppliers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/vehicle-selection`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/comparison`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/categories/motor`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/categories/kocnice`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/categories/elektronika`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/categories/karoserija`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/categories/suspenzija`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/categories/transmisija`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ];
}
