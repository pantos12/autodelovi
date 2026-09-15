import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ fontSize: '72px', marginBottom: '16px' }}>🔧</p>
        <h1 style={{ color: '#fff', fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
          404
        </h1>
        <p style={{ color: '#aaa', fontSize: '18px', marginBottom: '32px', maxWidth: '400px' }}>
          Stranica koju trazite ne postoji ili je premeštena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}
          >
            Pocetna
          </Link>
          <Link
            href="/marketplace"
            style={{ padding: '12px 28px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
