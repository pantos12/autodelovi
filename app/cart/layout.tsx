import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Korpa',
  description: 'Pregledajte artikle u korpi i nastavite ka plaćanju.',
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
