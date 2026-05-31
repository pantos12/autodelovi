import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plaćanje | AutoDelovi.sale',
  description: 'Završite kupovinu auto delova bezbednim plaćanjem.',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
