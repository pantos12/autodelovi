import type { Metadata } from 'next';
import HomeHero from './components/HomeHero';

export const metadata: Metadata = {
  title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu | Srbija',
  description: 'Agregiramo delimicno skladiste od 50,000+ auto delova od 200+ proverenih dobavljaca sirom Srbije. Pretrazite, uporedite i porucite.',
  openGraph: {
    title: 'AutoDelovi.sale - Premium Auto Delovi Srbija',
    description: 'Agregiramo delimicno skladiste od 50,000+ auto delova od 200+ proverenih dobavljaca sirom Srbije.',
    url: 'https://autodelovi.sale',
  },
};

export default function Home() {
  return <HomeHero />;
}
