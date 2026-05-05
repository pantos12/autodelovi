import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Korpa | AutoDelovi.sale',
  description: 'Pregledajte korpu i nastavite kupovinu auto delova.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
