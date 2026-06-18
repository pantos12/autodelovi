import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Placanje',
  description: 'Zavrsitev kupovinu auto delova bezbednim placanjem preko Stripe platforme.',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
