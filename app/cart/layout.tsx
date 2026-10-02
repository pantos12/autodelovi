import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Korpa',
  description: 'Pregledajte i uredite svoju korpu za kupovinu auto delova.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
