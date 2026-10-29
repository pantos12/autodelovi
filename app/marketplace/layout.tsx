import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace - Auto Delovi | AutoDelovi.sale',
  description: 'Pretrazite 50,000+ auto delova od 200+ proverenih dobavljaca u Srbiji. Filtrirajte po marki, kategoriji i dostupnosti.',
  openGraph: {
    title: 'Marketplace | AutoDelovi.sale',
    description: 'Pretrazite auto delove od proverenih dobavljaca u Srbiji.',
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
