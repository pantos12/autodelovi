import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plaćanje | AutoDelovi.sale',
  description: 'Sigurno plaćanje za vaše auto delove putem Stripe platforme.',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
