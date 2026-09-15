'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ fontSize: '72px', marginBottom: '16px' }}>⚠️</p>
        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
          Doslo je do greske
        </h1>
        <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '32px', maxWidth: '400px' }}>
          Nesto nije u redu. Pokusajte ponovo ili se vratite na pocetnu stranicu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', border: 'none', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
          >
            Pokusaj ponovo
          </button>
          <a
            href="/"
            style={{ padding: '12px 28px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}
          >
            Pocetna
          </a>
        </div>
      </div>
    </div>
  );
}
