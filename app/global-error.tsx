'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="sr">
      <body style={{ margin: 0, background: '#0c0d0f', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
        <div style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Došlo je do greške</h1>
          <p style={{ color: '#aaa', fontSize: '15px', marginBottom: '24px', maxWidth: '400px' }}>
            Nešto nije u redu. Pokušajte ponovo ili se vratite na početnu stranicu.
          </p>
          <button
            onClick={() => reset()}
            style={{ padding: '12px 24px', background: '#f9372c', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
          >
            Pokušaj ponovo
          </button>
        </div>
      </body>
    </html>
  );
}
