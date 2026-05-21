'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "Inter, 'Helvetica Neue', sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#x26A0;&#xFE0F;</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Došlo je do greške</h1>
        <p style={{ color: '#aaa', fontSize: '15px', marginBottom: '24px', maxWidth: '400px' }}>
          Nešto je pošlo naopako. Pokušajte ponovo ili se vratite na početnu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ padding: '12px 28px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
          >
            Pokušaj ponovo
          </button>
          <a href="/" style={{ padding: '12px 28px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Početna
          </a>
        </div>
      </div>
    </div>
  );
}
