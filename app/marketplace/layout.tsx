import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Pretražite 50,000+ auto delova od 200+ proverenih dobavljača širom Srbije. Filtrirajte po marki, kategoriji i ceni.',
  openGraph: {
    title: 'Marketplace | AutoDelovi.sale',
    description: 'Pretražite hiljade auto delova od proverenih dobavljača u Srbiji.',
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
