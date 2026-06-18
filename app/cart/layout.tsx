import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Korpa',
  description: 'Pregledajte izabrane auto delove u vasoj korpi. AutoDelovi.sale — brza i sigurna kupovina.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
