import type { Metadata } from 'next';
import './globals.css';
import NavBar from './components/NavBar';
import CartProvider from './components/CartProvider';

export const metadata: Metadata = {
  title: {
    default: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu | Srbija',
    template: '%s | AutoDelovi.sale',
  },
  description: 'AutoDelovi.sale je premium marketplace za auto delove u Srbiji. Pretrazite 50,000+ delova od 200+ proverenih dobavljaca. VW, BMW, Mercedes, Audi, Opel i jos mnogo.',
  keywords: ['auto delovi', 'auto delovi srbija', 'car parts serbia', 'rezervni delovi', 'auto delovi beograd', 'autodelovi', 'kocioni diskovi', 'filteri', 'amortizeri'],
  authors: [{ name: 'AutoDelovi.sale' }],
  creator: 'AutoDelovi.sale',
  metadataBase: new URL('https://autodelovi.sale'),
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'sr_RS',
    url: 'https://autodelovi.sale',
    siteName: 'AutoDelovi.sale',
    title: 'AutoDelovi.sale - Premium Auto Delovi Srbija',
    description: 'Agregiramo delimicno skladiste od 50,000+ auto delova od 200+ proverenih dobavljaca sirom Srbije.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoDelovi.sale - Premium Auto Delovi Srbija',
    description: 'Pretrazite 50,000+ auto delova od 200+ dobavljaca u Srbiji.',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'theme-color': '#f9372c',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f9372c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr">
      <body style={{ margin: 0, background: '#0c0d0f' }}>
        <a href="#main-content" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
          Preskoči na sadržaj
        </a>
        <CartProvider>
          <NavBar />
          <main id="main-content">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
