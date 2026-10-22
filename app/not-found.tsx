import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>🔧</div>
        <h1 style={{ color: '#fff', fontSize: '48px', fontWeight: 800, marginBottom: '8px' }}>404</h1>
        <p style={{ color: '#aaa', fontSize: '18px', marginBottom: '32px', maxWidth: '400px' }}>
          Stranica koju tražite nije pronađena ili je premeštena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
            Početna strana
          </Link>
          <Link href="/marketplace" style={{ padding: '12px 28px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}>
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
