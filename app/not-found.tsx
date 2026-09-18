import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      background: '#0c0d0f',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '80px', fontWeight: 800, color: '#f9372c', marginBottom: '8px', lineHeight: 1 }}>
          404
        </div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
          Stranica nije pronadjena
        </h1>
        <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          Ova stranica ne postoji ili je premeštena. Proverite URL ili se vratite na pocetnu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '12px 24px',
              background: '#f9372c',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Pocetna
          </Link>
          <Link
            href="/marketplace"
            style={{
              padding: '12px 24px',
              background: '#252629',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
