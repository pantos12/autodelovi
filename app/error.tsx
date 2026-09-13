'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>
          Došlo je do greške
        </h1>
        <p style={{ color: '#aaa', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
          Nešto je pošlo po zlu. Pokušajte ponovo ili se vratite na početnu stranu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', border: 'none', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
          >
            Pokušaj ponovo
          </button>
          <a href="/" style={{ padding: '12px 28px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Početna
          </a>
        </div>
      </div>
    </div>
  );
}
