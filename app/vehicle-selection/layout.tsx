import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Izbor Vozila',
  description: 'Unesite VIN broj ili izaberite marku i model vozila da pronađete kompatibilne auto delove.',
};

export default function VehicleSelectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
