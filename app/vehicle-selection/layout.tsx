import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Izbor Vozila | AutoDelovi.sale',
  description: 'Odaberite vaše vozilo i pronađite kompatibilne auto delove. Podržano i VIN dekodiranje.',
};

export default function VehicleSelectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
