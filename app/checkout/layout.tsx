import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plaćanje',
  description: 'Završite kupovinu auto delova — bezbedno online plaćanje.',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
