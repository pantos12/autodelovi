'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', fontFamily: 'Inter, "Helvetica Neue", sans-serif', padding: '24px', textAlign: 'center' }}>
      <span style={{ fontSize: '64px' }}>⚠️</span>
      <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, margin: 0 }}>Došlo je do greške</h1>
      <p style={{ color: '#aaa', fontSize: '14px', margin: 0, maxWidth: '400px' }}>
        Izvinjavamo se. Pokušajte ponovo ili se vratite na početnu stranu.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <button
          onClick={reset}
          style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
        >
          Pokušaj ponovo
        </button>
        <a href="/" style={{ padding: '12px 28px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Početna
        </a>
      </div>
    </div>
  );
}
