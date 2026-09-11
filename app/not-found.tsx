import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: '72px', marginBottom: '16px' }}>🔧</div>
        <h1 style={{ color: '#fff', fontSize: '48px', fontWeight: 800, marginBottom: '12px' }}>404</h1>
        <p style={{ color: '#aaa', fontSize: '18px', marginBottom: '32px', maxWidth: '400px' }}>
          Stranica koju tražite ne postoji ili je premeštena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}
          >
            Početna
          </Link>
          <Link
            href="/marketplace"
            style={{ padding: '12px 24px', background: '#252629', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
