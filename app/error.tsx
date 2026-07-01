'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
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
    }}>
      <div style={{ fontSize: '48px' }}>⚠️</div>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>
        Došlo je do greške
      </h1>
      <p style={{ color: '#aaa', fontSize: '14px', margin: 0, maxWidth: '400px', lineHeight: 1.6 }}>
        Izvinjavamo se — nešto je pošlo po zlu. Pokušajte ponovo ili se vratite na početnu stranicu.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button
          onClick={reset}
          style={{
            padding: '12px 24px',
            background: '#f9372c',
            borderRadius: '8px',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Pokušaj ponovo
        </button>
        <a
          href="/"
          style={{
            padding: '12px 24px',
            background: '#1a1b1f',
            borderRadius: '8px',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            border: '1px solid #333',
          }}
        >
          Početna
        </a>
      </div>
    </div>
  );
}
