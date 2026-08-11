import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Izbor Vozila',
  description: 'Izaberite marku, model, godiste i motor vaseg vozila da pronadjete kompatibilne auto delove.',
};

export default function VehicleSelectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
