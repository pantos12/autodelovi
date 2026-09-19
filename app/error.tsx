'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</p>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Nešto nije u redu</h1>
        <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          Došlo je do greške pri učitavanju stranice. Pokušajte ponovo ili se vratite na početnu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={reset} style={{ padding: '12px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Pokušaj ponovo
          </button>
          <a href="/" style={{ padding: '12px 24px', background: '#252629', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
            Početna strana
          </a>
        </div>
      </div>
    </div>
  );
}
