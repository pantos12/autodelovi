import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Izbor vozila',
  description: 'Izaberite marku, model, godište i motor vašeg vozila za preciznu pretragu auto delova. Ili dekodirajte VIN broj.',
};

export default function VehicleSelectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
