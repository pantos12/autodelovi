import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', fontFamily: 'Inter, "Helvetica Neue", sans-serif', padding: '24px', textAlign: 'center' }}>
      <span style={{ fontSize: '72px' }}>🔧</span>
      <h1 style={{ color: '#fff', fontSize: '36px', fontWeight: 800, margin: 0 }}>404</h1>
      <p style={{ color: '#aaa', fontSize: '16px', margin: 0, maxWidth: '400px' }}>
        Stranica koju tražite ne postoji ili je premeštena.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <Link href="/" style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Početna
        </Link>
        <Link href="/marketplace" style={{ padding: '12px 28px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Marketplace
        </Link>
      </div>
    </div>
  );
}
