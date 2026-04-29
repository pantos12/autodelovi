import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <div style={{ fontSize: '80px', fontWeight: 900, color: '#f9372c', letterSpacing: '-4px', marginBottom: '8px' }}>404</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Stranica nije pronađena</h1>
        <p style={{ color: '#888', fontSize: '15px', marginBottom: '32px', maxWidth: '400px', lineHeight: 1.6 }}>
          Izgleda da ova stranica ne postoji ili je premeštena. Proverite URL ili se vratite na početnu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
            Početna strana
          </Link>
          <Link href="/marketplace" style={{ padding: '12px 28px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
