import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Izbor vozila',
  description: 'Izaberite marku, model i godište vašeg vozila ili unesite VIN da pronađete kompatibilne delove.',
};

export default function VehicleSelectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
