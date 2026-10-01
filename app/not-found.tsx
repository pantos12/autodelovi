import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      background: '#0c0d0f',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
      padding: '24px',
      fontFamily: "'Inter','Helvetica Neue',sans-serif",
    }}>
      <div style={{ fontSize: '64px', fontWeight: 800, color: '#f9372c' }}>404</div>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>
        Stranica nije pronađena
      </h1>
      <p style={{ color: '#aaa', fontSize: '14px', margin: 0, textAlign: 'center', maxWidth: '400px' }}>
        Tražena stranica ne postoji ili je premeštena. Proverite URL ili se vratite na početnu.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <Link
          href="/"
          style={{
            padding: '12px 24px',
            background: '#f9372c',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Početna stranica
        </Link>
        <Link
          href="/marketplace"
          style={{
            padding: '12px 24px',
            background: '#1a1b1f',
            border: '1px solid #333',
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
  );
}
