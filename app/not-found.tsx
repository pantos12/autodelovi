import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ fontSize: '72px', fontWeight: 800, color: '#f9372c', marginBottom: '8px' }}>404</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Stranica nije pronadjena</h1>
        <p style={{ color: '#aaa', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
          Stranica koju trazite ne postoji ili je premeštena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}
          >
            Pocetna strana
          </Link>
          <Link
            href="/marketplace"
            style={{ padding: '12px 28px', background: '#252629', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
