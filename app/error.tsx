'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px', textAlign: 'center' }}>
      <span style={{ fontSize: '72px' }}>⚠️</span>
      <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, margin: 0 }}>Došlo je do greške</h1>
      <p style={{ color: '#aaa', fontSize: '15px', margin: 0, maxWidth: '400px', lineHeight: 1.6 }}>
        Nešto nije u redu. Pokušajte ponovo ili se vratite na početnu stranicu.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <button
          onClick={reset}
          style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
        >
          Pokušaj ponovo
        </button>
      </div>
    </div>
  );
}
