import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Pretražite i filtrirajte 50,000+ auto delova od 200+ dobavljača u Srbiji. Kocnice, filteri, amortizeri i još mnogo.',
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
