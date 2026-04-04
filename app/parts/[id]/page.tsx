import type { Metadata } from 'next';
import Link from 'next/link';
import { mockParts } from '../../lib/data';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const part = mockParts.find(p => p.id === params.id);
  if (!part) return { title: 'Deo nije pronadjen - AutoDelovi.sale' };
  return {
    title: part.nameSr + ' | ' + part.make + ' ' + part.model + ' - AutoDelovi.sale',
    description: part.description + ' OEM: ' + part.oem + '. Cena: ' + part.price.toLocaleString('sr-RS') + ' RSD.',
    keywords: [part.nameSr, part.make, part.model, part.oem, 'auto delovi', 'auto delovi srbija', part.category],
    openGraph: {
      title: part.nameSr + ' - AutoDelovi.sale',
      description: part.description,
      siteName: 'AutoDelovi.sale',
    },
  };
}

export function generateStaticParams() {
  return mockParts.map(p => ({ id: p.id }));
}

export default function PartDetail({ params }: { params: { id: string } }) {
  const part = mockParts.find(p => p.id === params.id);

  if (!part) {
    return (
      <div style={{ background: '#0c0d0f', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>404</div>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Deo nije pronadjen</h1>
          <Link href="/marketplace" style={{ color: '#f9372c', textDecoration: 'none', fontWeight: 600 }}>Nazad na Marketplace</Link>
        </div>
      </div>
    );
  }

  const relatedParts = mockParts.filter(p => p.id !== part.id && (p.make === part.make || p.categorySlug === part.categorySlug)).slice(0, 3);

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: '64px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(12,13,15,0.95)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link href="/marketplace" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>MARKETPLACE</Link>
          <Link href="/suppliers" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>DOBAVLJACI</Link>
          <Link href="/vehicle-selection" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>IZBOR VOZILA</Link>
          <Link href="/comparison" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>POREDENJE</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '32px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Pocetna</Link>
          <span>/</span>
          <Link href="/marketplace" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Marketplace</Link>
          <span>/</span>
          <Link href={'/categories/' + part.categorySlug} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{part.category}</Link>
          <span>/</span>
          <span style={{ color: '#fff' }}>{part.nameSr}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
          {/* LEFT - Details */}
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', color: '#f9372c', textTransform: 'uppercase', background: 'rgba(249,55,44,0.1)', border: '1px solid rgba(249,55,44,0.2)', padding: '4px 12px', borderRadius: '20px' }}>{part.category}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: part.inStock ? '#4ade80' : '#f87171', background: part.inStock ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', border: '1px solid', borderColor: part.inStock ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)', padding: '4px 12px', borderRadius: '20px' }}>
                {part.inStock ? 'Na stanju' : 'Trenutno nedostupno'}
              </span>
            </div>

            <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '12px', lineHeight: 1.1 }}>{part.nameSr}</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', marginBottom: '32px', lineHeight: 1.7 }}>{part.description}</p>

            {/* Specs table */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Specifikacije</div>
              {[
                { label: 'OEM broj', value: part.oem },
                { label: 'Marka vozila', value: part.make },
                { label: 'Model vozila', value: part.model },
                { label: 'Kompatibilnost (godina)', value: part.yearFrom + ' - ' + part.yearTo },
                { label: 'Kategorija', value: part.category },
                { label: 'Dobavljac', value: part.supplier },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', padding: '14px 20px', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <span style={{ width: '200px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Related parts */}
            {relatedParts.length > 0 && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Slicni delovi</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                  {relatedParts.map(p => (
                    <Link key={p.id} href={'/parts/' + p.id} style={{ textDecoration: 'none' }}>
                      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px', transition: 'border-color 0.2s' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,55,44,0.3)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)')}>
                        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#fff' }}>{p.nameSr}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>{p.make} {p.model}</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#f9372c' }}>{p.price.toLocaleString('sr-RS')} RSD</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT - Buy card */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px' }}>
              <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '4px' }}>{part.price.toLocaleString('sr-RS')} <span style={{ fontSize: '18px', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>RSD</span></div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>Cena ukljucuje PDV</div>

              <div style={{ marginBottom: '20px', padding: '14px', background: part.inStock ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,113,0.06)', borderRadius: '10px', border: '1px solid', borderColor: part.inStock ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: part.inStock ? '#4ade80' : '#f87171' }}>
                  {part.inStock ? 'Dostupno na stanju' : 'Trenutno nedostupno'}
                </span>
                {part.inStock && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Isporuka 1-3 radna dana</div>}
              </div>

              <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Dobavljac</span>
                {part.supplier}
              </div>

              <button style={{ width: '100%', background: part.inStock ? '#f9372c' : 'rgba(255,255,255,0.08)', color: part.inStock ? '#fff' : 'rgba(255,255,255,0.3)', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: part.inStock ? 'pointer' : 'not-allowed', marginBottom: '12px', letterSpacing: '0.5px' }}>
                {part.inStock ? 'Kontaktiraj dobavljaca' : 'Nije dostupno'}
              </button>

              <Link href={'/comparison?ids=' + part.id} style={{ textDecoration: 'none', display: 'block', textAlign: 'center', padding: '12px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                Dodaj za poredenje
              </Link>

              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                OEM: {part.oem}<br/>
                God. kompatibilnosti: {part.yearFrom}–{part.yearTo}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
