import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '72px', marginBottom: '16px', opacity: 0.8 }}>🔧</div>
        <h1 style={{ color: '#fff', fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>404</h1>
        <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 }}>
          Stranica koju tražite ne postoji ili je uklonjena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Početna
          </Link>
          <Link href="/marketplace" style={{ padding: '12px 24px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
