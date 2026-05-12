import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '72px', fontWeight: 800, color: '#f9372c', lineHeight: 1 }}>404</div>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Stranica nije pronađena</h1>
      <p style={{ color: '#aaa', fontSize: '15px', maxWidth: '400px', lineHeight: 1.5 }}>
        Stranica koju trazite ne postoji ili je premeštena. Proverite URL ili se vratite na početnu.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <Link href="/" style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Početna
        </Link>
        <Link href="/marketplace" style={{ padding: '12px 24px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Marketplace
        </Link>
      </div>
    </div>
  );
}
