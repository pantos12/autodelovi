import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, "Helvetica Neue", sans-serif', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px', lineHeight: 1 }}>🔧</div>
        <h1 style={{ color: '#fff', fontSize: '48px', fontWeight: 800, marginBottom: '8px' }}>
          4<span style={{ color: '#f9372c' }}>0</span>4
        </h1>
        <p style={{ color: '#aaa', fontSize: '18px', marginBottom: '8px' }}>
          Stranica nije pronađena
        </p>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '32px', lineHeight: 1.6 }}>
          Deo koji tražite je možda premešten ili više ne postoji. Pokušajte pretragu ili se vratite na početnu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
            Početna stranica
          </Link>
          <Link href="/marketplace" style={{ padding: '12px 28px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
