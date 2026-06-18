import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace - Auto Delovi',
  description: 'Pretrazite 50,000+ auto delova od proverenih dobavljaca u Srbiji. Filteri po marki, kategoriji, ceni i dostupnosti.',
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
