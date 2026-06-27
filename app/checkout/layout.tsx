import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plaćanje',
  description: 'Završite porudžbinu i platite bezbedno putem Stripe platforme.',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
