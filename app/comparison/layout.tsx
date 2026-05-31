import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poređenje Delova | AutoDelovi.sale',
  description: 'Uporedite auto delove po ceni, brendu, dostupnosti i specifikacijama.',
};

export default function ComparisonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
