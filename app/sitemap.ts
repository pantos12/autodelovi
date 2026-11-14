import type { MetadataRoute } from 'next';

const BASE = 'https://autodelovi.sale';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '/',
    '/marketplace',
    '/suppliers',
    '/comparison',
    '/vehicle-selection',
    '/cart',
    '/checkout',
  ];

  const categories = [
    'motor',
    'kocnice',
    'elektronika',
    'karoserija',
    'suspenzija',
    'transmisija',
    'ostalo',
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${BASE}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '/' ? 'daily' as const : 'weekly' as const,
      priority: route === '/' ? 1 : 0.8,
    })),
    ...categories.map((slug) => ({
      url: `${BASE}/categories/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
