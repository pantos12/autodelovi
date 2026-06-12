import type { Metadata } from 'next';
import HomeClient from './components/HomeClient';

export const metadata: Metadata = {
  title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu | Srbija',
  description: 'AutoDelovi.sale je premium marketplace za auto delove u Srbiji. Pretrazite 50,000+ delova od 200+ proverenih dobavljaca.',
  openGraph: {
    title: 'AutoDelovi.sale - Premium Auto Delovi Srbija',
    description: 'Agregiramo delimicno skladiste od 50,000+ auto delova od 200+ proverenih dobavljaca sirom Srbije.',
  },
};

export default function Home() {
  return <HomeClient />;
}
