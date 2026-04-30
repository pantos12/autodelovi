import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      background: '#0c0d0f',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
      padding: '24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '72px', fontWeight: 800, color: '#f9372c', lineHeight: 1 }}>404</div>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Stranica nije pronadjena</h1>
      <p style={{ color: '#888', fontSize: '14px', maxWidth: '400px', margin: 0 }}>
        Stranica koju trazite ne postoji ili je premeshtena. Proverite URL ili se vratite na pocetnu.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <Link
          href="/"
          style={{
            padding: '12px 28px',
            background: '#f9372c',
            borderRadius: '8px',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          Pocetna
        </Link>
        <Link
          href="/marketplace"
          style={{
            padding: '12px 28px',
            background: '#1a1b1f',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          Marketplace
        </Link>
      </div>
    </div>
  );
}
