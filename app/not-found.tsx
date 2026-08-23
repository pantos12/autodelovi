import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '72px', marginBottom: '16px' }}>404</div>
        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Stranica nije pronadjena</h1>
        <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '32px', maxWidth: '400px' }}>
          Stranica koju trazite ne postoji ili je uklonjena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/" style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Pocetna
          </Link>
          <Link href="/marketplace" style={{ padding: '12px 24px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
