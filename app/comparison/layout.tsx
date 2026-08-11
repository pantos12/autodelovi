import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uporedi Auto Delove',
  description: 'Uporedite cene, brendove i specifikacije auto delova od razlicitih dobavljaca na jednom mestu.',
};

export default function ComparisonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
