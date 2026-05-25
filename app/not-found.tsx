import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: '80px', lineHeight: 1 }}>🔧</div>
      <h1 style={{ color: '#fff', fontSize: '48px', fontWeight: 800, margin: 0 }}>404</h1>
      <p style={{ color: '#aaa', fontSize: '18px', margin: 0, maxWidth: '400px' }}>
        Stranica koju tražite ne postoji ili je premeštena.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Početna strana
        </Link>
        <Link href="/marketplace" style={{ padding: '12px 28px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px', border: '1px solid #333' }}>
          Marketplace
        </Link>
      </div>
    </div>
  );
}
