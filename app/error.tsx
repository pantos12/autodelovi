'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
        <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Došlo je do greške</h1>
        <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          Nešto nije u redu. Pokušajte ponovo ili se vratite na početnu stranicu.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ padding: '12px 24px', background: '#f9372c', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Pokušaj ponovo
          </button>
          <a
            href="/"
            style={{ padding: '12px 24px', background: '#252629', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
          >
            Početna stranica
          </a>
        </div>
      </div>
    </div>
  );
}
