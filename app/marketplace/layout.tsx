import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace - Svi Auto Delovi | AutoDelovi.sale',
  description: 'Pretražite 50,000+ auto delova od 200+ proverenih dobavljača u Srbiji. Filteri po marki, kategoriji, ceni i dostupnosti.',
  openGraph: {
    title: 'Marketplace | AutoDelovi.sale',
    description: 'Premium auto delovi za sve marke - VW, BMW, Mercedes, Audi, Opel i još mnogo.',
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
