import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace - Auto Delovi',
  description: 'Pretrazite i kupite auto delove od proverenih dobavljaca u Srbiji. Filteri ulja, kocioni diskovi, amortizeri i jos mnogo.',
  openGraph: {
    title: 'AutoDelovi.sale Marketplace',
    description: 'Pretrazite 50,000+ auto delova od 200+ dobavljaca u Srbiji.',
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
