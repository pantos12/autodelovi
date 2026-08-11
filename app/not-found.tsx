import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: '72px', fontWeight: 800, color: '#f9372c', marginBottom: '8px' }}>404</div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Stranica nije pronadjena</h1>
        <p style={{ fontSize: '15px', color: '#888', marginBottom: '32px', maxWidth: '400px' }}>
          Stranica koju trazite ne postoji ili je premeshtena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '12px 28px', background: '#f9372c', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Pocetna
          </Link>
          <Link href="/marketplace" style={{ padding: '12px 28px', background: '#1a1b1f', border: '1px solid #333', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
