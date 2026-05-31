'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#9888;&#65039;</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>
          Došlo je do greške
        </h1>
        <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          Nešto je pošlo naopako. Pokušajte ponovo ili se vratite na početnu stranu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ padding: '12px 28px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
          >
            Pokušaj ponovo
          </button>
          <a
            href="/"
            style={{ padding: '12px 28px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}
          >
            Početna strana
          </a>
        </div>
      </div>
    </div>
  );
}
