/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
    remotePatterns: [
      { protocol: 'https', hostname: '**.spareto.com' },
      { protocol: 'https', hostname: '**.summitracing.com' },
      { protocol: 'https', hostname: '**.autodoc.de' },
      { protocol: 'https', hostname: '**.aibearing.com' },
      { protocol: 'https', hostname: '**.turbifycdn.com' },
      { protocol: 'https', hostname: '**.autohub.rs' },
      { protocol: 'https', hostname: '**.prodajadelova.rs' },
      { protocol: 'https', hostname: '**.delovionline.rs' },
      { protocol: 'https', hostname: '**.alvadi.rs' },
      { protocol: 'https', hostname: '**.polovniautomobili.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
