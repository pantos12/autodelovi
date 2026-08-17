import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poređenje delova',
  description: 'Uporedite auto delove po ceni, brendu i dostupnosti. Pronađite najbolju ponudu.',
};

export default function ComparisonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
