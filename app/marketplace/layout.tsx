import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace - Svi Auto Delovi',
  description: 'Pretražite 50,000+ auto delova od proverenih dobavljača u Srbiji. Filteri po marki, kategoriji, ceni. Besplatna dostava za porudžbine preko 10,000 RSD.',
  openGraph: {
    title: 'AutoDelovi.sale - Marketplace',
    description: 'Pretražite hiljade auto delova po najboljim cenama u Srbiji.',
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
