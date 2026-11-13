import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: '480px' }}>
        <div style={{ fontSize: '120px', fontWeight: 900, color: '#f9372c', lineHeight: 1, marginBottom: '16px', letterSpacing: '-4px' }}>
          404
        </div>
        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
          Stranica nije pronađena
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.6, marginBottom: '36px' }}>
          Tražena stranica ne postoji ili je uklonjena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '12px 28px', background: '#f9372c', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
            Nazad na početnu
          </Link>
          <Link href="/marketplace" style={{ padding: '12px 28px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
            Idi na marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
