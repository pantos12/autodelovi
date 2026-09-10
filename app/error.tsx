'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px', textAlign: 'center' }}>
      <span style={{ fontSize: '64px' }}>⚠️</span>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: 0 }}>
        Nešto nije u redu
      </h1>
      <p style={{ color: '#aaa', fontSize: '14px', margin: 0, maxWidth: '400px' }}>
        Došlo je do greške prilikom učitavanja stranice. Pokušajte ponovo.
      </p>
      <button
        onClick={reset}
        style={{ marginTop: '8px', padding: '12px 32px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
      >
        Pokušaj ponovo
      </button>
    </div>
  );
}
