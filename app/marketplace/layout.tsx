import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace - Auto Delovi | AutoDelovi.sale',
  description: 'Pretrazite 50,000+ auto delova od 200+ proverenih dobavljaca u Srbiji. Filteri po marki, kategoriji i ceni.',
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
