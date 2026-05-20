import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://autodelovi.sale';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/callback', '/checkout', '/order/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
