import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <p style={{ fontSize: '72px', fontWeight: 800, color: '#252629', marginBottom: '8px' }}>404</p>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Stranica nije pronađena</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
          Stranica koju tražite ne postoji ili je premeštena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/" style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Početna strana
          </Link>
          <Link href="/marketplace" style={{ padding: '12px 24px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
