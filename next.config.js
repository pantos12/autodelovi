/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  experimental: {
    serverComponentsExternalPackages: [
      'playwright-extra',
      'puppeteer-extra',
      'puppeteer-extra-plugin',
      'puppeteer-extra-plugin-stealth',
      'clone-deep',
      'merge-deep',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.spareto.com' },
      { protocol: 'https', hostname: '**.spareto.com' },
      { protocol: 'https', hostname: 'static.summitracing.com' },
      { protocol: 'https', hostname: '**.summitracing.com' },
      { protocol: 'https', hostname: 'cdn.autodoc.de' },
      { protocol: 'https', hostname: '**.autodoc.de' },
      { protocol: 'https', hostname: 'aibearing.com' },
      { protocol: 'https', hostname: '**.aibearing.com' },
      { protocol: 'https', hostname: 's.turbifycdn.com' },
      { protocol: 'https', hostname: '**.turbifycdn.com' },
      { protocol: 'https', hostname: 'autohub.rs' },
      { protocol: 'https', hostname: '**.autohub.rs' },
      { protocol: 'https', hostname: 'prodajadelova.rs' },
      { protocol: 'https', hostname: '**.prodajadelova.rs' },
      { protocol: 'https', hostname: 'delovionline.rs' },
      { protocol: 'https', hostname: '**.delovionline.rs' },
      { protocol: 'https', hostname: 'alvadi.rs' },
      { protocol: 'https', hostname: '**.alvadi.rs' },
      { protocol: 'https', hostname: 'polovniautomobili.com' },
      { protocol: 'https', hostname: '**.polovniautomobili.com' },
    ],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
    {
      source: '/images/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ],
};

module.exports = nextConfig;
