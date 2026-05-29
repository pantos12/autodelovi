import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px', lineHeight: 1 }}>404</div>
        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>
          Stranica nije pronađena
        </h1>
        <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '32px', maxWidth: '400px', lineHeight: 1.6 }}>
          Stranica koju tražite ne postoji ili je premeštena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}
          >
            Početna strana
          </Link>
          <Link
            href="/marketplace"
            style={{ padding: '12px 28px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '15px', border: '1px solid #333' }}
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
