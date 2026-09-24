'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
        }}
      >
        !
      </div>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>
        Nesto nije u redu
      </h1>
      <p style={{ color: '#aaa', fontSize: '14px', margin: 0, maxWidth: '400px', lineHeight: 1.6 }}>
        Doslo je do neocekivane greske. Pokusajte ponovo ili se vratite na pocetnu stranicu.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button
          onClick={reset}
          style={{
            padding: '12px 28px',
            background: '#f9372c',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Pokusaj ponovo
        </button>
        <a
          href="/"
          style={{
            padding: '12px 28px',
            background: '#1a1b1f',
            border: '1px solid #2a2b2f',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Pocetna
        </a>
      </div>
    </div>
  );
}
