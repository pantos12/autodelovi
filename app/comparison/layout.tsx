import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poređenje Delova',
  description: 'Uporedite do 3 auto dela po ceni, brendu, raspoloživosti i ostalim karakteristikama.',
};

export default function ComparisonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
