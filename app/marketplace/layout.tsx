import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace - Svi Auto Delovi | AutoDelovi.sale',
  description: 'Pretražite 50,000+ auto delova od 200+ proverenih dobavljača u Srbiji. Filtrirajte po marki, kategoriji, ceni i dostupnosti.',
  openGraph: {
    title: 'Marketplace | AutoDelovi.sale',
    description: 'Pretražite auto delove od proverenih dobavljača. VW, BMW, Mercedes, Audi, Opel i više.',
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
