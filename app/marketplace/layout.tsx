import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Pretražite 50,000+ auto delova od 200+ proverenih dobavljača širom Srbije. Filtrirajte po kategoriji, marki vozila i ceni.',
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
