import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Izbor vozila | AutoDelovi.sale',
  description: 'Izaberite marku, model i motor vašeg vozila da pronađete odgovarajuće auto delove.',
};

export default function VehicleSelectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
