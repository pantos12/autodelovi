import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPartBySlug, getPartById, getRelatedParts } from '@/lib/supabase';
import type { Part } from '@/lib/types';
import AddToCartButton from '@/app/components/AddToCartButton';
import InquiryButton from '@/app/components/InquiryButton';

export const dynamic = 'force-dynamic';

async function fetchPart(id: string): Promise<Part | null> {
  const bySlug = await getPartBySlug(id);
  if (bySlug) return bySlug;
  return getPartById(id);
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const part = await fetchPart(params.id);
  if (!part) return { title: 'Deo nije pronađen' };
  return {
    title: (part.name_sr || part.name) + ' | AutoDelovi.sale',
    description: part.description_sr || part.description || `${part.name_sr || part.name}. OEM: ${part.oem_number || part.part_number}.`,
    keywords: [part.name, part.name_sr, part.brand, part.category_id, 'auto delovi', 'Srbija'].filter(Boolean) as string[],
    openGraph: {
      title: part.name_sr || part.name,
      description: `${part.brand} - ${part.price.toLocaleString('sr-RS')} RSD`,
      images: part.images?.[0] ? [{ url: part.images[0] }] : undefined,
    },
  };
}

function ProductJsonLd({ part }: { part: Part }) {
  const inStock = (part.stock_quantity ?? 0) > 0;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: part.name_sr || part.name,
    description: part.description_sr || part.description || `${part.brand} ${part.name}`,
    sku: part.part_number,
    mpn: part.oem_number || part.part_number,
    brand: { '@type': 'Brand', name: part.brand },
    image: part.images?.[0] || undefined,
    offers: {
      '@type': 'Offer',
      url: `https://autodelovi.sale/parts/${part.slug || part.id}`,
      priceCurrency: 'RSD',
      price: part.price,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: part.supplier
        ? { '@type': 'Organization', name: part.supplier.name }
        : undefined,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function PartDetail({ params }: { params: { id: string } }) {
  const part = await fetchPart(params.id);
  if (!part) notFound();

  const related = await getRelatedParts(part, 4).catch(() => []);
  const inStock = (part.stock_quantity ?? 0) > 0;

  const specs = [
    { label: 'Broj dela', value: part.part_number },
    { label: 'OEM broj', value: part.oem_number },
    { label: 'Kategorija', value: part.category?.name_sr || part.category_id },
    { label: 'Marka', value: part.brand },
    { label: 'Stanje', value: part.condition === 'new' ? 'Novo' : part.condition === 'used' ? 'Polovno' : 'Obnovljeno' },
    ...((part.compatible_vehicles?.[0]) ? [
      { label: 'Vozilo', value: `${part.compatible_vehicles[0].make} ${part.compatible_vehicles[0].model}` },
      { label: 'Godište', value: `${part.compatible_vehicles[0].year_from}${part.compatible_vehicles[0].year_to ? ' – ' + part.compatible_vehicles[0].year_to : '+'}` },
    ] : []),
    { label: 'Dobavljač', value: part.supplier?.name },
  ].filter(s => s.value);

  const allImages = part.images?.length ? part.images : ['/images/part-placeholder.svg'];

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <ProductJsonLd part={part} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', fontSize: '14px', flexWrap: 'wrap' }}>
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
        </nav>

        <div className="part-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
          {/* Left column */}
          <div>
            {/* Main image */}
            <div style={{ position: 'relative', background: '#1a1b1f', borderRadius: '16px', height: '320px', marginBottom: '12px', border: '1px solid #252629', overflow: 'hidden' }}>
              <Image
                src={allImages[0]}
                alt={part.name}
                fill
                sizes="(max-width: 1200px) 100vw, 800px"
                style={{ objectFit: allImages[0] !== '/images/part-placeholder.svg' ? 'contain' : 'cover', padding: allImages[0] !== '/images/part-placeholder.svg' ? '16px' : 0 }}
                priority
                unoptimized
              />
            </div>

            {/* Thumbnail strip */}
            {part.images && part.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
                {part.images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', border: i === 0 ? '2px solid #ff4d00' : '2px solid #252629', flexShrink: 0 }}>
                    <Image src={img} alt={`${part.name} ${i + 1}`} fill sizes="64px" style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                ))}
              </div>
            )}

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

            {/* Compatible vehicles */}
            {part.compatible_vehicles && part.compatible_vehicles.length > 1 && (
              <div style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid #252629', marginBottom: '24px' }}>
                <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, padding: '16px 20px', borderBottom: '1px solid #252629' }}>Kompatibilna vozila</h2>
                {part.compatible_vehicles.map((v, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', borderBottom: i < part.compatible_vehicles.length - 1 ? '1px solid #252629' : 'none' }}>
                    <span style={{ color: '#fff', fontSize: '13px' }}>{v.make} {v.model}</span>
                    <span style={{ color: '#aaa', fontSize: '13px' }}>{v.year_from}{v.year_to ? `–${v.year_to}` : '+'} {v.engine || ''}</span>
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

              {inStock ? (
                <AddToCartButton part={part} inStock={inStock} full />
              ) : (
                <InquiryButton part={part} label="Pošalji upit za dostupnost" />
              )}

              <div style={{ height: '10px' }} />
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

              {/* Free shipping notice */}
              {part.price < 10000 && (
                <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(249,55,44,0.08)', borderRadius: '8px', border: '1px solid rgba(249,55,44,0.2)' }}>
                  <p style={{ color: '#f9372c', fontSize: '12px', margin: 0 }}>
                    Besplatna dostava za porudžbine preko 10,000 RSD
                  </p>
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
              {related.map((rp) => (
                <Link key={rp.id} href={`/parts/${rp.slug || rp.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid #252629', transition: 'border-color 0.15s' }}>
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
                      <span style={{ display: 'block', padding: '7px', background: '#ff4d00', borderRadius: '8px', color: '#fff', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>Vidi detalje</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
