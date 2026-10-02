import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Izbor vozila',
  description: 'Izaberite vozilo po marki, modelu i godištu ili unesite VIN broj za automatsku pretragu delova.',
};

export default function VehicleSelectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
