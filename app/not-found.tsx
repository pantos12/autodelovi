import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <p style={{ fontSize: '72px', marginBottom: '16px' }}>404</p>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Stranica nije pronadjena</h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
          Stranica koju trazite ne postoji ili je premeshtena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Pocetna
          </Link>
          <Link href="/marketplace" style={{ padding: '12px 24px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
