import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from './components/NavBar';
import CartProvider from './components/CartProvider';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

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
  openGraph: {
    type: 'website',
    locale: 'sr_RS',
    url: 'https://autodelovi.sale',
    siteName: 'AutoDelovi.sale',
    title: 'AutoDelovi.sale - Premium Auto Delovi Srbija',
    description: 'Agregiramo delimicno skladiste od 50,000+ auto delova od 200+ proverenih dobavljaca sirom Srbije.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AutoDelovi.sale - Premium Auto Delovi Srbija' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoDelovi.sale - Premium Auto Delovi Srbija',
    description: 'Pretrazite 50,000+ auto delova od 200+ dobavljaca u Srbiji.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://autodelovi.sale',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" className={inter.variable}>
      <body style={{ margin: 0, background: '#0c0d0f', fontFamily: 'var(--font-inter), "Helvetica Neue", sans-serif' }}>
        <CartProvider>
          <NavBar />
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
