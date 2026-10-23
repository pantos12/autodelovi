import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from './components/NavBar';
import CartProvider from './components/CartProvider';

const inter = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap' });

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr">
      <body className={inter.className} style={{ margin: 0, background: '#0c0d0f', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CartProvider>
          <NavBar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>© 2026 AutoDelovi.sale</span>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="/marketplace" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Marketplace</a>
              <a href="/suppliers" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Dobavljaci</a>
              <a href="/comparison" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Poredenje</a>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
