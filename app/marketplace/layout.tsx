import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace - Pretrazi Auto Delove',
  description: 'Pretrazite 50,000+ auto delova od 200+ proverenih dobavljaca u Srbiji. Filtrirajte po marki, kategoriji, ceni.',
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
