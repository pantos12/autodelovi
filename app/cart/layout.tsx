import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Korpa',
  description: 'Pregledajte i upravljajte stavkama u vašoj korpi za kupovinu.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
