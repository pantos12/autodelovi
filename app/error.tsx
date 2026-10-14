'use client';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#9888;</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Doslo je do greske</h1>
        <p style={{ color: '#aaa', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
          Nesto nije u redu. Pokusajte ponovo ili se vratite na pocetnu stranicu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={reset} style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Pokusaj ponovo
          </button>
        </div>
      </div>
    </div>
  );
}
