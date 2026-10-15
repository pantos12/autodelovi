import type { Metadata } from 'next';
import HomeSearch from './components/HomeSearch';

export const metadata: Metadata = {
  title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu',
  description: 'Agregiramo 50,000+ auto delova od 200+ proverenih dobavljaca sirom Srbije. Pretrazite po vozilu, brendu ili broju dela.',
  openGraph: {
    title: 'AutoDelovi.sale - Premium Auto Delovi Srbija',
    description: 'Agregiramo 50,000+ auto delova od 200+ proverenih dobavljaca sirom Srbije.',
    url: 'https://autodelovi.sale',
  },
};

export default function Home() {
  return <HomeSearch />;
}
