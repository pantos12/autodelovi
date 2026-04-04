import Link from 'next/link';
import { suppliers, mockParts } from '../lib/data';

export default function SuppliersPage() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: '64px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(12,13,15,0.95)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link href="/marketplace" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>MARKETPLACE</Link>
          <Link href="/suppliers" style={{ color: '#f9372c', fontWeight: 600, fontSize: '13px', letterSpacing: '1px', textDecoration: 'none', borderBottom: '2px solid #f9372c', paddingBottom: '2px' }}>DOBAVLJACI</Link>
          <Link href="/vehicle-selection" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>IZBOR VOZILA</Link>
          <Link href="/comparison" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>POREDENJE</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(249,55,44,0.1)', border: '1px solid rgba(249,55,44,0.25)', borderRadius: '20px', padding: '6px 16px', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: '#f9372c', textTransform: 'uppercase' }}>Provereni partneri</span>
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>Dobavljaci</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '560px', lineHeight: 1.6 }}>
            Svi dobavljaci na AutoDelovi.sale prolaze kroz rigoroznu verifikaciju. Radimo iskljucivo sa pouzdanim uvoznicima i distribterima auto delova.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '48px' }}>
          {[
            { label: 'Proverenih dobavljaca', value: '200+' },
            { label: 'Ukupno delova', value: '50,000+' },
            { label: 'Gradova Srbije', value: '15+' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#f9372c', marginBottom: '8px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Supplier grid */}
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Istaknuti dobavljaci</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {suppliers.map(supplier => {
            const partCount = mockParts.filter(p => p.supplier === supplier.name).length;
            return (
              <div key={supplier.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,55,44,0.3)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{supplier.name}</h3>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>📍 {supplier.city}</span>
                  </div>
                  {supplier.verified && (
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: '#4ade80', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>Verifikovan</span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: '20px' }}>{supplier.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>{supplier.rating}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Ocena</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>{supplier.parts.toLocaleString('sr-RS')}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Delova</div>
                    </div>
                  </div>
                  <Link href={'/marketplace?supplier=' + encodeURIComponent(supplier.name)} style={{ textDecoration: 'none', background: 'transparent', color: '#f9372c', border: '1px solid rgba(249,55,44,0.4)', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    Pogledaj →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ marginTop: '64px', background: 'rgba(249,55,44,0.06)', border: '1px solid rgba(249,55,44,0.15)', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Imate auto salon ili servis?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>Pridruzite se nasoj mrezi proverenih dobavljaca i dostignite hiljade kupaca sirom Srbije.</p>
          <Link href="mailto:partneri@autodelovi.sale" style={{ display: 'inline-block', textDecoration: 'none', background: '#f9372c', color: '#fff', padding: '14px 32px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px' }}>
            Postanite partner →
          </Link>
        </div>
      </div>
    </div>
  );
}
