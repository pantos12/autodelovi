import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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
      <style>{`
        .part-detail-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          align-items: start;
        }
        .part-detail-buycard {
          position: sticky;
          top: 80px;
        }
        .part-detail-image {
          height: 320px;
        }
        .part-detail-title {
          font-size: 28px;
        }
        .part-detail-price {
          font-size: 32px;
        }
        .part-detail-breadcrumb {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 24px;
          font-size: 14px;
          flex-wrap: wrap;
        }
        .part-detail-related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        .part-detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 16px;
        }
        .part-detail-spec-row {
          padding: 12px 20px;
        }
        .part-detail-section-heading {
          font-size: 18px;
          padding: 16px 20px;
        }

        @media (max-width: 899px) {
          .part-detail-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .part-detail-buycard {
            position: static;
          }
          .part-detail-container {
            padding: 16px 12px;
          }
          .part-detail-image {
            height: 240px;
          }
          .part-detail-title {
            font-size: 22px;
          }
          .part-detail-price {
            font-size: 26px;
          }
          .part-detail-breadcrumb {
            font-size: 13px;
            gap: 6px;
            margin-bottom: 16px;
          }
          .part-detail-spec-row {
            padding: 10px 14px;
          }
          .part-detail-section-heading {
            font-size: 16px;
            padding: 14px 14px;
          }
          .part-detail-related-grid {
            display: flex;
            overflow-x: auto;
            gap: 12px;
            padding-bottom: 8px;
            -webkit-overflow-scrolling: touch;
            scroll-snap-type: x mandatory;
          }
          .part-detail-related-grid > * {
            min-width: 200px;
            max-width: 220px;
            flex-shrink: 0;
            scroll-snap-align: start;
          }
          .part-detail-related-grid::-webkit-scrollbar {
            height: 4px;
          }
          .part-detail-related-grid::-webkit-scrollbar-track {
            background: #1a1b1f;
            border-radius: 2px;
          }
          .part-detail-related-grid::-webkit-scrollbar-thumb {
            background: #333;
            border-radius: 2px;
          }
        }
      `}</style>
      <div className="part-detail-container">
        {/* Breadcrumb */}
        <div className="part-detail-breadcrumb">
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

        <div className="part-detail-grid">
          {/* Left column */}
          <div>
            {/* Image */}
            <div className="part-detail-image" style={{ position: 'relative', background: '#1a1b1f', borderRadius: '16px', marginBottom: '24px', border: '1px solid #252629', overflow: 'hidden' }}>
              <Image
                src={part.images?.[0] || '/images/part-placeholder.svg'}
                alt={part.name}
                fill
                sizes="(max-width: 1200px) 100vw, 800px"
                style={{ objectFit: part.images?.[0] ? 'contain' : 'cover', padding: part.images?.[0] ? '16px' : 0 }}
                priority
                unoptimized
              />
            </div>

            {/* Title */}
            <h1 className="part-detail-title" style={{ color: '#fff', fontWeight: 800, marginBottom: '8px' }}>{part.name_sr || part.name}</h1>
            <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '24px' }}>{part.name_sr ? part.name : part.part_number}</p>

            {/* Specs */}
            <div style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid #252629', marginBottom: '24px' }}>
              <h2 className="part-detail-section-heading" style={{ color: '#fff', fontWeight: 700, borderBottom: '1px solid #252629' }}>Specifikacije</h2>
              {specs.map((spec, i) => (
                <div key={i} className="part-detail-spec-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i < specs.length - 1 ? '1px solid #252629' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
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
                <h2 className="part-detail-section-heading" style={{ color: '#fff', fontWeight: 700, borderBottom: '1px solid #252629' }}>Tehničke karakteristike</h2>
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
          <div className="part-detail-buycard">
            <div style={{ background: '#1a1b1f', borderRadius: '16px', padding: '24px', border: '1px solid #252629' }}>
              <div className="part-detail-price" style={{ fontWeight: 800, color: '#ff4d00', marginBottom: '4px' }}>
                {part.price.toLocaleString('sr-RS')} RSD
              </div>
              {part.price_eur && (
                <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>≈ €{part.price_eur.toFixed(2)}</div>
              )}
              <p style={{ color: inStock ? '#22c55e' : '#ef4444', fontSize: '14px', marginBottom: '20px', fontWeight: 600 }}>
                {inStock ? `✓ Na stanju (${part.stock_quantity} kom)` : '✗ Trenutno nema na stanju'}
              </p>
              <AddToCartButton part={part} inStock={inStock} full />
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
            <div className="part-detail-related-grid">
              {related.map((rp, idx) => {
                const rpInStock = (rp.stock_quantity ?? 0) > 0;
                return (
                  <div key={rp.id} style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid #252629' }}>
                    <div style={{ position: 'relative', background: '#252629', height: '120px', overflow: 'hidden' }}>
                      <Image
                        src={rp.images?.[0] || '/images/part-placeholder.svg'}
                        alt={rp.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 220px"
                        style={{ objectFit: 'cover' }}
                        loading="lazy"
                        unoptimized
                      />
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
