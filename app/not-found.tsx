import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '72px', fontWeight: 800, color: '#f9372c', marginBottom: '8px' }}>404</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Stranica nije pronadjena</h1>
        <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          Stranica koju trazite ne postoji ili je premeshtena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            Pocetna strana
          </Link>
          <Link
            href="/marketplace"
            style={{ padding: '12px 24px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
