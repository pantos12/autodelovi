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
        fontFamily: "'Inter','Helvetica Neue',sans-serif",
        padding: '24px',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div
          style={{
            fontSize: '72px',
            fontWeight: 900,
            color: '#f9372c',
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          404
        </div>
        <h1
          style={{
            color: '#fff',
            fontSize: '28px',
            fontWeight: 800,
            marginBottom: '12px',
          }}
        >
          Stranica nije pronadjena
        </h1>
        <p
          style={{
            color: '#aaa',
            fontSize: '15px',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}
        >
          Stranica koju trazite ne postoji ili je premeshtena. Proverite URL ili se
          vratite na pocetnu stranicu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '12px 28px',
              background: '#f9372c',
              borderRadius: '10px',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '15px',
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
              borderRadius: '10px',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '15px',
            }}
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
