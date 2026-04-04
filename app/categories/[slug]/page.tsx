'use client';
import Link from 'next/link';
import { mockParts, categories } from '../../lib/data';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const category = categories.find(c => c.slug === slug);
  const parts = mockParts.filter(p => p.categorySlug === slug);

  if (!category) {
    return (
      <div style={{ background: '#0c0d0f', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Kategorija nije pronadjena</h1>
          <Link href="/" style={{ color: '#f9372c' }}>Nazad na pocetnu</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: '64px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(12,13,15,0.95)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link href="/marketplace" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>MARKETPLACE</Link>
          <Link href="/suppliers" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>DOBAVLJACI</Link>
          <Link href="/comparison" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>POREDENJE</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '32px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Pocetna</Link>
          <span>/</span>
          <Link href="/marketplace" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Marketplace</Link>
          <span>/</span>
          <span style={{ color: '#fff' }}>{category.name}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(249,55,44,0.1)', border: '1px solid rgba(249,55,44,0.25)', borderRadius: '20px', padding: '6px 16px', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: '#f9372c', textTransform: 'uppercase' }}>Kategorija</span>
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>{category.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '600px', lineHeight: 1.6 }}>{category.description}</p>
        </div>

        {/* All categories nav */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <Link key={cat.slug} href={'/categories/' + cat.slug} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '8px 20px', borderRadius: '24px', border: '1px solid', fontSize: '13px', fontWeight: 500, cursor: 'pointer', borderColor: cat.slug === slug ? '#f9372c' : 'rgba(255,255,255,0.12)', background: cat.slug === slug ? 'rgba(249,55,44,0.1)' : 'transparent', color: cat.slug === slug ? '#f9372c' : 'rgba(255,255,255,0.6)' }}>
                {cat.name}
              </div>
            </Link>
          ))}
        </div>

        {/* Parts */}
        {parts.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ marginBottom: '16px' }}>Nema delova u ovoj kategoriji.</p>
            <Link href="/marketplace" style={{ color: '#f9372c', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Idi na Marketplace →</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {parts.map(part => (
              <div key={part.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,55,44,0.3)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: '#f9372c', textTransform: 'uppercase', background: 'rgba(249,55,44,0.1)', padding: '3px 8px', borderRadius: '4px' }}>{part.make}</span>
                  <span style={{ fontSize: '11px', color: part.inStock ? '#4ade80' : '#f87171', fontWeight: 600 }}>{part.inStock ? '● Na stanju' : '● Nije dostupno'}</span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{part.nameSr}</h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>{part.make} {part.model} ({part.yearFrom}–{part.yearTo})</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '16px', lineHeight: 1.5 }}>{part.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>{part.price.toLocaleString('sr-RS')} RSD</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>OEM: {part.oem}</div>
                  </div>
                  <Link href={'/marketplace?category=' + part.categorySlug + '&make=' + part.make} style={{ textDecoration: 'none', background: '#f9372c', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    Vidi vise
                  </Link>
                </div>
                <div style={{ marginTop: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>📦 {part.supplier}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <Link href="/marketplace" style={{ display: 'inline-block', textDecoration: 'none', background: 'transparent', color: '#f9372c', border: '1px solid #f9372c', padding: '12px 32px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Sve kategorije →
          </Link>
        </div>
      </div>
    </div>
  );
}
