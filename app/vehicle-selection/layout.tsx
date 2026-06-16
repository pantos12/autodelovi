import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Izbor vozila',
  description: 'Odaberite marku, model i godište vašeg automobila da biste pronašli odgovarajuće delove.',
};

export default function VehicleSelectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
