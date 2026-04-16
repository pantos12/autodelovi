'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
          Nešto nije u redu
        </h1>
        <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '24px', maxWidth: '400px' }}>
          Došlo je do greške prilikom učitavanja stranice. Pokušajte ponovo.
        </p>
        <button
          onClick={reset}
          style={{ padding: '12px 28px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
        >
          Pokušaj ponovo
        </button>
      </div>
    </div>
  );
}
