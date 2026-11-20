import type { Metadata } from 'next';
import HomeContent from './components/HomeContent';

export const metadata: Metadata = {
  title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu | Srbija',
  description: 'AutoDelovi.sale je premium marketplace za auto delove u Srbiji. Pretrazite 50,000+ delova od 200+ proverenih dobavljaca. VW, BMW, Mercedes, Audi, Opel i jos mnogo.',
  keywords: ['auto delovi', 'auto delovi srbija', 'car parts serbia', 'rezervni delovi', 'autodelovi', 'kocioni diskovi', 'filteri', 'amortizeri'],
  openGraph: {
    type: 'website',
    locale: 'sr_RS',
    url: 'https://autodelovi.sale',
    siteName: 'AutoDelovi.sale',
    title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu',
    description: 'Agregiramo delimicno skladiste od 50,000+ auto delova od 200+ proverenih dobavljaca sirom Srbije.',
  },
};

export default function Home() {
  return <HomeContent />;
}
