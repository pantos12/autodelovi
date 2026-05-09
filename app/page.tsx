import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu | Srbija',
  description: 'Agregiramo 50,000+ auto delova od 200+ proverenih dobavljaca sirom Srbije. Pretrazite VW, BMW, Mercedes, Audi, Opel delove.',
  keywords: ['auto delovi', 'auto delovi srbija', 'rezervni delovi', 'autodelovi', 'auto delovi beograd'],
};

export default function Home() {
  return <HomeClient />;
}
