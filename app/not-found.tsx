import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '72px', fontWeight: 900, color: '#f9372c', lineHeight: 1, marginBottom: '16px' }}>404</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Stranica nije pronađena</h1>
        <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
          Stranica koju tražite ne postoji ili je premeštena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Početna
          </Link>
          <Link href="/marketplace" style={{ padding: '12px 28px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
