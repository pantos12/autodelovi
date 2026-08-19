'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', color: '#fff' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Nesto nije u redu</h2>
      <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px', maxWidth: '400px', textAlign: 'center' }}>
        Doslo je do greske prilikom ucitavanja stranice. Pokusajte ponovo.
      </p>
      <button
        onClick={reset}
        style={{ padding: '12px 32px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
      >
        Pokusaj ponovo
      </button>
    </div>
  );
}
