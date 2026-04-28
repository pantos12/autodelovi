import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/checkout', '/order/'],
      },
    ],
    sitemap: 'https://autodelovi.sale/sitemap.xml',
  };
}
