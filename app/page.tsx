import type { Metadata } from 'next';
import HomeHero from './components/HomeHero';

export const metadata: Metadata = {
  title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu | Srbija',
  description: 'AutoDelovi.sale je premium marketplace za auto delove u Srbiji. Pretrazite 50,000+ delova od 200+ proverenih dobavljaca. VW, BMW, Mercedes, Audi, Opel i jos mnogo.',
  keywords: ['auto delovi', 'auto delovi srbija', 'car parts serbia', 'rezervni delovi', 'auto delovi beograd', 'autodelovi'],
  openGraph: {
    title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu',
    description: 'Agregiramo delimicno skladiste od 50,000+ auto delova od 200+ proverenih dobavljaca sirom Srbije.',
    type: 'website',
    locale: 'sr_RS',
  },
};

export default function Home() {
  return <HomeHero />;
}
