'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <span style={{ fontSize: '64px' }}>⚠️</span>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Došlo je do greške</h1>
      <p style={{ color: '#aaa', fontSize: '14px', margin: 0, textAlign: 'center', maxWidth: '400px' }}>
        {error.message || 'Nešto je pošlo po zlu. Pokušajte ponovo.'}
      </p>
      <button
        onClick={reset}
        style={{ marginTop: '12px', padding: '12px 32px', background: '#f9372c', borderRadius: '8px', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
      >
        Pokušaj ponovo
      </button>
    </div>
  );
}
