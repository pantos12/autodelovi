import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plaćanje',
  description: 'Unesite podatke za dostavu i završite kupovinu auto delova.',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
