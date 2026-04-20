import type { Metadata } from 'next';
import HomeContent from './components/HomeContent';

export const metadata: Metadata = {
  title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu | Srbija',
  description: 'Premium marketplace za auto delove u Srbiji. Pretrazite 50,000+ delova od 200+ proverenih dobavljaca.',
  openGraph: {
    title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu',
    description: 'Agregiramo 50,000+ auto delova od 200+ proverenih dobavljaca sirom Srbije.',
  },
};

export default function Home() {
  return <HomeContent />;
}
