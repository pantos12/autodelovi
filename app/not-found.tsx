import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <span style={{ fontSize: '64px' }}>🔍</span>
      <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, margin: 0 }}>404</h1>
      <p style={{ color: '#aaa', fontSize: '16px', margin: 0 }}>Stranica nije pronađena</p>
      <p style={{ color: '#666', fontSize: '14px', margin: 0, textAlign: 'center', maxWidth: '400px' }}>
        Stranica koju tražite ne postoji ili je premeštena.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <Link
          href="/"
          style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}
        >
          Početna
        </Link>
        <Link
          href="/marketplace"
          style={{ padding: '12px 24px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}
        >
          Marketplace
        </Link>
      </div>
    </div>
  );
}
