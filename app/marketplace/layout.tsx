import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Pretražite 50,000+ auto delova od 200+ proverenih dobavljača širom Srbije. Filtriranje po marki, kategoriji, ceni i dostupnosti.',
  openGraph: {
    title: 'Marketplace | AutoDelovi.sale',
    description: 'Pretražite 50,000+ auto delova od 200+ proverenih dobavljača širom Srbije.',
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
