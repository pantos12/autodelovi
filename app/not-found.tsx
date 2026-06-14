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
      fontFamily: 'Inter, "Helvetica Neue", sans-serif',
    }}>
      <span style={{ fontSize: '64px', color: '#f9372c', fontWeight: 800 }}>404</span>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>
        Stranica nije pronađena
      </h1>
      <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>
        Stranica koju tražite ne postoji ili je premeštena.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <Link
          href="/"
          style={{
            padding: '12px 24px',
            background: '#f9372c',
            borderRadius: '8px',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          Početna
        </Link>
        <Link
          href="/marketplace"
          style={{
            padding: '12px 24px',
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
