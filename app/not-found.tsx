import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#0c0d0f', color: '#fff' }}>
      <div style={{ fontSize: '72px', fontWeight: 800, color: '#f9372c', marginBottom: '8px' }}>404</div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Stranica nije pronađena</h1>
      <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px', textAlign: 'center', maxWidth: '400px' }}>
        Stranica koju tražite ne postoji ili je premeštena.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link
          href="/"
          style={{ padding: '10px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
        >
          Početna
        </Link>
        <Link
          href="/marketplace"
          style={{ padding: '10px 24px', background: '#252629', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
        >
          Marketplace
        </Link>
      </div>
    </div>
  );
}
