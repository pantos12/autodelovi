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
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>&#9888;&#65039;</p>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Doslo je do greske</h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
          Nesto nije u redu. Pokusajte ponovo ili se vratite na pocetnu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ padding: '12px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
          >
            Pokusaj ponovo
          </button>
        </div>
      </div>
    </div>
  );
}
