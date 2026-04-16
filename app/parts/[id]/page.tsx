import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPartBySlug, getPartById, getRelatedParts } from '@/lib/supabase';
import type { Part } from '@/lib/types';
import AddToCartButton from '@/app/components/AddToCartButton';

export const dynamic = 'force-dynamic';

async function fetchPart(id: string): Promise<Part | null> {
  // Try slug first, then UUID
  const bySlug = await getPartBySlug(id);
  if (bySlug) return bySlug;
  return getPartById(id);
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const part = await fetchPart(params.id);
  if (!part) return { title: 'Deo nije pronađen' };
  const vehicle = part.compatible_vehicles?.[0];
  return {
    title: (part.name_sr || part.name) + ' | AutoDelovi.sale',
    description: part.description_sr || part.description || `${part.name_sr || part.name}. OEM: ${part.oem_number || part.part_number}.`,
    keywords: [part.name, part.name_sr, part.brand, part.category_id, 'auto delovi', 'Srbija'].filter(Boolean) as string[],
    openGraph: {
      title: part.name_sr || part.name,
      description: `${part.brand} - ${part.price.toLocaleString('sr-RS')} RSD`,
    },
  };
}

export default async function PartDetail({ params }: { params: { id: string } }) {
  const part = await fetchPart(params.id);
  if (!part) notFound();

  const related = await getRelatedParts(part, 4).catch(() => []);
  const vehicle = part.compatible_vehicles?.[0];
  const inStock = (part.stock_quantity ?? 0) > 0;

  const specs = [
    { label: 'Broj dela', value: part.part_number },
    { label: 'OEM broj', value: part.oem_number },
    { label: 'Kategorija', value: part.category?.name_sr || part.category_id },
    { label: 'Marka', value: part.brand },
    { label: 'Stanje', value: part.condition === 'new' ? 'Novo' : part.condition === 'used' ? 'Polovno' : 'Obnovljeno' },
    ...(vehicle ? [
      { label: 'Vozilo', value: `${vehicle.make} ${vehicle.model}` },
      { label: 'Godište', value: `${vehicle.year_from}${vehicle.year_to ? ' – ' + vehicle.year_to : '+'}` },
    ] : []),
    { label: 'Dobavljač', value: part.supplier?.name },
  ].filter(s => s.value);

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', fontSize: '14px' }}>
          <Link href="/" style={{ color: '#aaa', textDecoration: 'none' }}>Početna</Link>
          <span style={{ color: '#555' }}>/</span>
          <Link href="/marketplace" style={{ color: '#aaa', textDecoration: 'none' }}>Marketplace</Link>
          <span style={{ color: '#555' }}>/</span>
          {part.category && (
            <>
              <Link href={`/categories/${part.category_id}`} style={{ color: '#aaa', textDecoration: 'none' }}>{part.category.name_sr || part.category_id}</Link>
              <span style={{ color: '#555' }}>/</span>
            </>
          )}
          <span style={{ color: '#fff' }}>{part.name_sr || part.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
          {/* Left column */}
          <div>
            {/* Image */}
            <div style={{ background: '#1a1b1f', borderRadius: '16px', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid #252629', overflow: 'hidden' }}>
              {part.images?.[0]
                ? <img src={part.images[0]} alt={part.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} />
                : <img src="/images/part-placeholder.svg" alt="Auto deo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>

            {/* Title */}
            <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>{part.name_sr || part.name}</h1>
            <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '24px' }}>{part.name_sr ? part.name : part.part_number}</p>

            {/* Specs */}
            <div style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid #252629', marginBottom: '24px' }}>
              <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, padding: '16px 20px', borderBottom: '1px solid #252629' }}>Specifikacije</h2>
              {specs.map((spec, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', borderBottom: i < specs.length - 1 ? '1px solid #252629' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <span style={{ color: '#aaa', fontSize: '14px' }}>{spec.label}</span>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            {(part.description_sr || part.description) && (
              <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', border: '1px solid #252629', marginBottom: '24px' }}>
                <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Opis</h2>
                <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6' }}>{part.description_sr || part.description}</p>
              </div>
            )}

            {/* Specs map */}
            {part.specs && Object.keys(part.specs).length > 0 && (
              <div style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid #252629', marginBottom: '24px' }}>
                <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, padding: '16px 20px', borderBottom: '1px solid #252629' }}>Tehničke karakteristike</h2>
                {Object.entries(part.specs).map(([key, val], i, arr) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', borderBottom: i < arr.length - 1 ? '1px solid #252629' : 'none' }}>
                    <span style={{ color: '#aaa', fontSize: '13px', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                    <span style={{ color: '#fff', fontSize: '13px' }}>{String(val)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Buy card */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div style={{ background: '#1a1b1f', borderRadius: '16px', padding: '24px', border: '1px solid #252629' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#ff4d00', marginBottom: '4px' }}>
                {part.price.toLocaleString('sr-RS')} RSD
              </div>
              {part.price_eur && (
                <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>≈ €{part.price_eur.toFixed(2)}</div>
              )}
              <p style={{ color: inStock ? '#22c55e' : '#ef4444', fontSize: '14px', marginBottom: '20px', fontWeight: 600 }}>
                {inStock ? `✓ Na stanju (${part.stock_quantity} kom)` : '✗ Trenutno nema na stanju'}
              </p>
              <AddToCartButton
                part={{
                  id: part.id,
                  slug: part.slug,
                  name: part.name_sr || part.name,
                  brand: part.brand,
                  price: part.price,
                  price_currency: part.price_currency,
                  image: part.images?.[0],
                  supplier_name: part.supplier?.name,
                }}
                inStock={inStock}
              />
              <Link
                href={`/comparison?ids=${part.id}`}
                style={{ display: 'block', width: '100%', padding: '12px', background: '#252629', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' as const }}
              >
                ≈ Uporedi
              </Link>
              {part.supplier && (
                <div style={{ marginTop: '20px', padding: '16px', background: '#0c0d0f', borderRadius: '10px' }}>
                  <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '4px' }}>Dobavljač</p>
                  <p style={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>{part.supplier.name}</p>
                  {part.supplier.city && <p style={{ color: '#aaa', fontSize: '13px' }}>📍 {part.supplier.city}</p>}
                  {part.supplier.is_verified && (
                    <span style={{ display: 'inline-block', marginTop: '8px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                      ✓ Verifikovan
                    </span>
                  )}
                </div>
              )}
              {part.source_url && (
                <a href={part.source_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', marginTop: '12px', color: '#aaa', fontSize: '12px', textDecoration: 'none' }}>
                  Pogledaj na sajtu dobavljača →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Related parts */}
        {related.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>Slični delovi</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {related.map(rp => {
                const rpInStock = (rp.stock_quantity ?? 0) > 0;
                return (
                  <div key={rp.id} style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid #252629' }}>
                    <div style={{ background: '#252629', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', overflow: 'hidden' }}>
                      {rp.images?.[0] ? <img src={rp.images[0]} alt={rp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <img src="/images/part-placeholder.svg" alt="Auto deo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ padding: '12px' }}>
                      <p style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px' }}>{rp.brand}</p>
                      <h3 style={{ color: '#fff', fontSize: '13px', marginBottom: '8px', lineHeight: '1.3' }}>{rp.name_sr || rp.name}</h3>
                      <p style={{ color: '#ff4d00', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{rp.price.toLocaleString('sr-RS')} RSD</p>
                      <Link href={`/parts/${rp.slug || rp.id}`} style={{ display: 'block', padding: '7px', background: '#ff4d00', borderRadius: '8px', color: '#fff', textDecoration: 'none', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>Vidi detalje</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
