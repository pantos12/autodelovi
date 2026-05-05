import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poređenje delova | AutoDelovi.sale',
  description: 'Uporedite cene i specifikacije auto delova od razlicitih dobavljaca.',
};

export default function ComparisonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
