import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Izbor vozila',
  description: 'Izaberite marku, model i godište vozila da pronađete kompatibilne auto delove.',
};

export default function VehicleSelectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
