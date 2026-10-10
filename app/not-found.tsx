import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px', lineHeight: 1 }}>🔧</div>
        <h1 style={{ color: '#fff', fontSize: '48px', fontWeight: 800, marginBottom: '8px' }}>404</h1>
        <h2 style={{ color: '#aaa', fontSize: '20px', fontWeight: 500, marginBottom: '24px' }}>
          Stranica nije pronadjena
        </h2>
        <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>
          Deo koji trazite mozda je premesten ili vise nije dostupan. Pokusajte sa pretragom ili se vratite na pocetnu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
            Pocetna
          </Link>
          <Link href="/marketplace" style={{ padding: '12px 28px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
