import Link from 'next/link';
import Image from 'next/image';
import { getParts, getCategories } from '@/lib/supabase';
import type { Metadata } from 'next';

const STATIC_CATEGORIES = [
  { slug: 'motor', name: 'Motor', icon: '⚙️', description: 'Delovi za motor' },
  { slug: 'kocnice', name: 'Kocnice', icon: '🛑', description: 'Kočioni sistem' },
  { slug: 'elektronika', name: 'Elektronika', icon: '⚡', description: 'Elektronski delovi' },
  { slug: 'karoserija', name: 'Karoserija', icon: '🚗', description: 'Karoserijski delovi' },
  { slug: 'suspenzija', name: 'Suspenzija', icon: '🔧', description: 'Ovjesi i amortizeri' },
  { slug: 'transmisija', name: 'Transmisija', icon: '⚙️', description: 'Menjač i kvačilo' },
  { slug: 'ostalo', name: 'Ostalo', icon: '📦', description: 'Ostali delovi' },
];

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cat = STATIC_CATEGORIES.find(c => c.slug === params.slug);
  return {
    title: cat ? cat.name + ' | AutoDelovi.sale' : 'Kategorija | AutoDelovi.sale',
    description: cat?.description || 'Auto delovi po kategorijama.',
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = STATIC_CATEGORIES.find(c => c.slug === params.slug);

  const [partsResult, dbCategories] = await Promise.all([
    getParts({ category: params.slug, per_page: 60 }).catch(() => ({ parts: [] as any[], total: 0, page: 1, per_page: 60, total_pages: 1 })),
    getCategories().catch(() => []),
  ]);

  const parts = partsResult.parts || [];
  const displayCategories = dbCategories.length > 0
    ? dbCategories
    : STATIC_CATEGORIES.map(c => ({ id: c.slug, slug: c.slug, name: c.name, name_sr: c.name, icon: c.icon, sort_order: 0 }));

  if (!category) {
    return (
      <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '48px' }}>🔍</p>
          <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '12px' }}>Kategorija nije pronađena</h1>
          <Link href="/marketplace" style={{ color: '#ff4d00', textDecoration: 'none' }}>← Nazad na marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a1b1f 0%, #0c0d0f 100%)', padding: '48px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Link href="/" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Početna</Link>
            <span style={{ color: '#555' }}>/</span>
            <Link href="/marketplace" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Marketplace</Link>
            <span style={{ color: '#555' }}>/</span>
            <span style={{ color: '#fff', fontSize: '14px' }}>{category.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '48px' }}>{category.icon}</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>{category.name}</h1>
              <p style={{ color: '#aaa', fontSize: '16px' }}>{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ borderBottom: '1px solid #252629', background: '#141517' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '0', overflowX: 'auto' }}>
          {STATIC_CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              style={{
                padding: '14px 20px',
                color: cat.slug === params.slug ? '#ff4d00' : '#aaa',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: cat.slug === params.slug ? 600 : 400,
                borderBottom: cat.slug === params.slug ? '2px solid #ff4d00' : '2px solid transparent',
                whiteSpace: 'nowrap' as const,
              }}
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Parts grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px' }}>{parts.length} delova u kategoriji "{category.name}"</p>
        {parts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {parts.map((part: any, idx: number) => {
              const inStock = (part.stock_quantity ?? 0) > 0;
              const imgSrc = part.images?.[0] || '/images/part-placeholder.svg';
              return (
                <div key={part.id} style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid #252629' }}>
                  <div style={{ position: 'relative', background: '#252629', height: '130px', overflow: 'hidden' }}>
                    <Image
                      src={imgSrc}
                      alt={part.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 220px"
                      style={{ objectFit: 'cover' }}
                      priority={idx < 4}
                      loading={idx < 4 ? undefined : 'lazy'}
                      unoptimized
                    />
                  </div>
                  <div style={{ padding: '12px' }}>
                    <p style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px' }}>{part.brand || ''}</p>
                    <h3 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', lineHeight: '1.3' }}>{part.name_sr || part.name}</h3>
                    <p style={{ color: '#ff4d00', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                      {part.price.toLocaleString('sr-RS')} RSD
                    </p>
                    <p style={{ color: inStock ? '#22c55e' : '#ef4444', fontSize: '12px', marginBottom: '10px' }}>
                      {inStock ? '✓ Na stanju' : '✗ Nema na stanju'}
                    </p>
                    <Link
                      href={`/parts/${part.slug || part.id}`}
                      style={{ display: 'block', padding: '8px', background: '#ff4d00', borderRadius: '8px', color: '#fff', textDecoration: 'none', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}
                    >
                      Vidi više
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📦</p>
            <p style={{ fontSize: '18px', color: '#aaa', marginBottom: '24px' }}>Nema delova u ovoj kategoriji</p>
            <Link href="/marketplace" style={{ padding: '12px 28px', background: '#ff4d00', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>
              Vidi sve delove
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
