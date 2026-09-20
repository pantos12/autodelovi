import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace - Svi Auto Delovi',
  description: 'Pretražite i kupite auto delove od proverenih dobavljača u Srbiji. Filteri po kategoriji, marki, ceni i raspoloživosti.',
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
