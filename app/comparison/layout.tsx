import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poređenje delova',
  description: 'Uporedite cene, specifikacije i dostupnost auto delova od različitih dobavljača.',
};

export default function ComparisonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
