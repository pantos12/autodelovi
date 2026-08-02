import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plaćanje',
  description: 'Završite svoju porudžbinu auto delova bezbedno preko Stripe platforme.',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
