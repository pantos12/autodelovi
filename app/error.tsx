'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, "Helvetica Neue", sans-serif', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>&#x26A0;&#xFE0F;</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Doslo je do greske</h1>
        <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>
          Nesto je poslo naopako. Pokusajte ponovo ili se vratite na pocetnu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ padding: '12px 28px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
          >
            Pokusaj ponovo
          </button>
          <a href="/" style={{ padding: '12px 28px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Pocetna
          </a>
        </div>
      </div>
    </div>
  );
}
