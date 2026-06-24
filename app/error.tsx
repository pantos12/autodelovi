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
      <div style={{ textAlign: 'center', padding: '24px', maxWidth: '480px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>&#x26A0;&#xFE0F;</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
          Nesto nije u redu
        </h1>
        <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          Doslo je do greske pri ucitavanju stranice. Pokusajte ponovo ili se vratite na pocetnu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{ padding: '12px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Pokusaj ponovo
          </button>
          <a
            href="/"
            style={{ padding: '12px 24px', background: '#252629', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            Pocetna
          </a>
        </div>
      </div>
    </div>
  );
}
