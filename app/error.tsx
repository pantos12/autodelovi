'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>&#x26A0;&#xFE0F;</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Nesto nije u redu</h1>
        <p style={{ color: '#aaa', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
          Doslo je do greske prilikom ucitavanja stranice. Pokusajte ponovo ili se vratite na pocetnu stranu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ padding: '12px 28px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
          >
            Pokusaj ponovo
          </button>
          <a
            href="/"
            style={{ padding: '12px 28px', background: '#252629', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
          >
            Pocetna strana
          </a>
        </div>
      </div>
    </div>
  );
}
