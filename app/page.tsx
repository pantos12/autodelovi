import type { Metadata } from 'next';
import HomeHero from './components/HomeHero';

export const metadata: Metadata = {
  title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu',
  description: 'Agregiramo delimicno skladiste od 50,000+ delova od 200+ proverenih dobavljaca sirom Srbije.',
  openGraph: {
    title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu',
    description: 'Agregiramo delimicno skladiste od 50,000+ delova od 200+ proverenih dobavljaca sirom Srbije.',
  },
};

export default function Home() {
  return <HomeHero />;
}
