import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        background: '#0c0d0f',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        fontFamily: 'Inter, "Helvetica Neue", sans-serif',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '72px',
          fontWeight: 800,
          color: '#f9372c',
          lineHeight: 1,
        }}
      >
        404
      </div>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>
        Stranica nije pronadjena
      </h1>
      <p style={{ color: '#aaa', fontSize: '14px', margin: 0, maxWidth: '400px', lineHeight: 1.6 }}>
        Stranica koju trazite ne postoji ili je premestena.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <Link
          href="/"
          style={{
            padding: '12px 28px',
            background: '#f9372c',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            textDecoration: 'none',
          }}
        >
          Pocetna stranica
        </Link>
        <Link
          href="/marketplace"
          style={{
            padding: '12px 28px',
            background: '#1a1b1f',
            border: '1px solid #2a2b2f',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            textDecoration: 'none',
          }}
        >
          Marketplace
        </Link>
      </div>
    </div>
  );
}
