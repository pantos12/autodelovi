import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Korpa | AutoDelovi.sale',
  description: 'Pregledajte i uredite svoju korpu za kupovinu auto delova.',
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
