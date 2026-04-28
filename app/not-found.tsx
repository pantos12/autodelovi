import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '72px', fontWeight: 800, color: '#f9372c', marginBottom: '8px' }}>404</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Stranica nije pronađena</h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '32px' }}>Stranica koju tražite ne postoji ili je premeštena.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}
          >
            Početna
          </Link>
          <Link
            href="/marketplace"
            style={{ padding: '12px 28px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
