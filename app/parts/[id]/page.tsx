import type { Metadata } from 'next';
import Link from 'next/link';
import { mockParts } from '../../lib/data';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const part = mockParts.find(p => p.id === params.id);
  if (!part) return { title: 'Deo nije pronađen' };
  return {
    title: part.nameSr + ' | AutoDelovi.sale',
    description: part.description || `${part.nameSr} za ${part.make} ${part.model}. OEM: ${part.oem}.`,
    keywords: [part.name, part.nameSr, part.make, part.model, part.category, 'auto delovi', 'Srbija'],
    openGraph: {
      title: part.nameSr,
      description: `${part.make} ${part.model} - ${part.price.toLocaleString('sr-RS')} RSD`,
    },
  };
}

export function generateStaticParams() {
  return mockParts.map(p => ({ id: p.id }));
}

export default function PartDetail({ params }: { params: { id: string } }) {
  const part = mockParts.find(p => p.id === params.id);
  if (!part) notFound();

  const related = mockParts
    .filter(p => p.id !== part.id && (p.categorySlug === part.categorySlug || p.make === part.make))
    .slice(0, 4);

  const specs = [
    { label: 'OEM broj', value: part.oem },
    { label: 'Kategorija', value: part.category },
    { label: 'Marka', value: part.make },
    { label: 'Model', value: part.model },
    { label: 'Godišta', value: `${part.yearFrom} - ${part.yearTo}` },
    { label: 'Dobavljač', value: part.supplier },
  ];

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', fontSize: '14px' }}>
          <Link href="/" style={{ color: '#aaa', textDecoration: 'none' }}>Početna</Link>
          <span style={{ color: '#555' }}>/</span>
          <Link href="/marketplace" style={{ color: '#aaa', textDecoration: 'none' }}>Marketplace</Link>
          <span style={{ color: '#555' }}>/</span>
          <Link href={`/categories/${part.categorySlug}`} style={{ color: '#aaa', textDecoration: 'none' }}>{part.category}</Link>
          <span style={{ color: '#555' }}>/</span>
          <span style={{ color: '#fff' }}>{part.nameSr}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
          {/* Left column */}
          <div>
            {/* Image */}
            <div style={{ background: '#1a1b1f', borderRadius: '16px', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', marginBottom: '24px', border: '1px solid #252629' }}>
              {part.image}
            </div>

            {/* Info */}
            <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>{part.nameSr}</h1>
            <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '24px' }}>{part.name}</p>

            {/* Specs */}
            <div style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid #252629', marginBottom: '24px' }}>
              <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, padding: '16px 20px', borderBottom: '1px solid #252629' }}>Specifikacije</h2>
              {specs.map((spec, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', borderBottom: i < specs.length - 1 ? '1px solid #1a1b1f' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <span style={{ color: '#aaa', fontSize: '14px' }}>{spec.label}</span>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>{spec.value}</span>
                </div>
              ))}
            </div>

            {part.description && (
              <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', border: '1px solid #252629', marginBottom: '24px' }}>
                <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Opis</h2>
                <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6' }}>{part.description}</p>
              </div>
            )}
          </div>

          {/* Right: Buy card */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div style={{ background: '#1a1b1f', borderRadius: '16px', padding: '24px', border: '1px solid #252629' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#ff4d00', marginBottom: '8px' }}>
                {part.price.toLocaleString('sr-RS')} RSD
              </div>
              <p style={{ color: part.inStock ? '#22c55e' : '#ef4444', fontSize: '14px', marginBottom: '20px', fontWeight: 600 }}>
                {part.inStock ? '✓ Na stanju' : '✗ Trenutno nema na stanju'}
              </p>
              <button style={{ width: '100%', padding: '14px', background: part.inStock ? '#ff4d00' : '#555', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '16px', fontWeight: 700, cursor: part.inStock ? 'pointer' : 'not-allowed', marginBottom: '12px' }}>
                {part.inStock ? '🛒 Dodaj u korpu' : 'Nema na stanju'}
              </button>
              <Link
                href={`/comparison?ids=${part.id}`}
                style={{ display: 'block', width: '100%', padding: '12px', background: '#252629', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' as const }}
              >
                ≈ Uporedi
              </Link>
              <div style={{ marginTop: '20px', padding: '16px', background: '#0c0d0f', borderRadius: '10px' }}>
                <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '4px' }}>Dobavljač</p>
                <p style={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>{part.supplier}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related parts */}
        {related.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>Slični delovi</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {related.map(rp => (
                <div key={rp.id} style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid #252629' }}>
                  <div style={{ background: '#252629', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>{rp.image}</div>
                  <div style={{ padding: '12px' }}>
                    <p style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px' }}>{rp.make} {rp.model}</p>
                    <h3 style={{ color: '#fff', fontSize: '13px', marginBottom: '8px', lineHeight: '1.3' }}>{rp.nameSr}</h3>
                    <p style={{ color: '#ff4d00', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{rp.price.toLocaleString('sr-RS')} RSD</p>
                    <Link href={`/parts/${rp.id}`} style={{ display: 'block', padding: '7px', background: '#ff4d00', borderRadius: '8px', color: '#fff', textDecoration: 'none', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>Vidi detalje</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
                  }
