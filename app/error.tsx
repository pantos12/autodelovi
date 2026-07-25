'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#0c0d0f', color: '#fff' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Nešto je pošlo naopako</h1>
      <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px', textAlign: 'center', maxWidth: '400px' }}>
        Došlo je do greške. Pokušajte ponovo ili se vratite na početnu stranu.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={reset}
          style={{ padding: '10px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
        >
          Pokušaj ponovo
        </button>
        <a
          href="/"
          style={{ padding: '10px 24px', background: '#252629', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
        >
          Početna
        </a>
      </div>
    </div>
  );
}
