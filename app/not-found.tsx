import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: '480px' }}>
        <p style={{ fontSize: '80px', fontWeight: 800, color: '#f9372c', marginBottom: '0', lineHeight: 1 }}>404</p>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Stranica nije pronadjena</h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '32px', lineHeight: 1.6 }}>
          Stranica koju trazite ne postoji ili je premeštena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            Pocetna stranica
          </Link>
          <Link
            href="/marketplace"
            style={{ padding: '12px 24px', background: '#333', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
