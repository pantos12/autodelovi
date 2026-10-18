'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '24px', maxWidth: '440px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Nesto nije u redu</h1>
        <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          Doslo je do greske prilikom ucitavanja stranice. Pokusajte ponovo ili se vratite na pocetnu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', border: 'none', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
          >
            Pokusaj ponovo
          </button>
          <a
            href="/"
            style={{ padding: '12px 28px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}
          >
            Pocetna
          </a>
        </div>
      </div>
    </div>
  );
}
