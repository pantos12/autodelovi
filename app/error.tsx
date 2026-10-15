'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', color: '#fff' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Doslo je do greske</h2>
      <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px', maxWidth: '400px', textAlign: 'center' }}>
        Nesto nije u redu. Pokusajte ponovo ili se vratite na pocetnu stranicu.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={reset}
          style={{ padding: '10px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
        >
          Pokusaj ponovo
        </button>
        <a
          href="/"
          style={{ padding: '10px 24px', background: '#333', border: 'none', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}
        >
          Pocetna
        </a>
      </div>
    </div>
  );
}
