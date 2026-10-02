import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prijava',
  description: 'Prijavite se ili kreirajte nalog na AutoDelovi.sale platformi.',
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
