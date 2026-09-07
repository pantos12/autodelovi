import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poređenje delova',
  description: 'Uporedite do 3 auto dela jedan pored drugog — cena, brend, stanje i dostupnost.',
};

export default function ComparisonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
