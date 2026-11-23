import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AutoDelovi.sale - Auto Delovi Srbija',
    short_name: 'AutoDelovi',
    description: 'Premium marketplace za auto delove u Srbiji. 50,000+ delova od 200+ dobavljača.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0d0f',
    theme_color: '#f9372c',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
