import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: '72px', fontWeight: 800, color: '#f9372c', lineHeight: 1 }}>404</div>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Stranica nije pronadjena</h1>
      <p style={{ color: '#aaa', fontSize: '14px', margin: 0, maxWidth: '400px' }}>
        Stranica koju trazite ne postoji ili je premeshtena.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <Link href="/" style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Pocetna
        </Link>
        <Link href="/marketplace" style={{ padding: '12px 24px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Marketplace
        </Link>
      </div>
    </div>
  );
}
