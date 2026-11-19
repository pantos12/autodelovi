'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Došlo je do greške</h1>
        <p style={{ color: '#aaa', fontSize: '15px', marginBottom: '32px', maxWidth: '400px' }}>
          Nešto nije u redu. Molimo pokušajte ponovo.
        </p>
        <button
          onClick={reset}
          style={{ padding: '12px 28px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
        >
          Pokušaj ponovo
        </button>
      </div>
    </div>
  );
}
