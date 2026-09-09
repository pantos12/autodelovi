'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: '480px' }}>
        <p style={{ fontSize: '56px', marginBottom: '16px' }}>⚠️</p>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Doslo je do greske</h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
          Nesto nije u redu. Pokusajte ponovo ili se vratite na pocetnu stranicu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ padding: '12px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Pokusaj ponovo
          </button>
          <a
            href="/"
            style={{ padding: '12px 24px', background: '#333', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            Pocetna
          </a>
        </div>
      </div>
    </div>
  );
}
