import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <p style={{ fontSize: '72px', fontWeight: 800, color: '#f9372c', marginBottom: '8px', lineHeight: 1 }}>404</p>
        <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Stranica nije pronadjena</h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
          Stranica koju trazite ne postoji ili je premeštena.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/" style={{ padding: '10px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
            Pocetna
          </Link>
          <Link href="/marketplace" style={{ padding: '10px 24px', background: '#252629', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
