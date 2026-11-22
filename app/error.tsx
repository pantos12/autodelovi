'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      <div style={{ fontSize: '48px' }}>&#x26A0;&#xFE0F;</div>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Doslo je do greske</h1>
      <p style={{ color: '#aaa', fontSize: '14px', margin: 0, textAlign: 'center', maxWidth: '400px' }}>
        Nesto nije u redu. Molimo pokusajte ponovo.
      </p>
      <button onClick={reset} style={{ marginTop: '8px', padding: '12px 32px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
        Pokusaj ponovo
      </button>
    </div>
  );
}
