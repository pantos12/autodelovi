'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', fontFamily: "Inter, 'Helvetica Neue', sans-serif", padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px' }}>&#x26A0;&#xFE0F;</div>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Doslo je do greske</h1>
      <p style={{ color: '#aaa', fontSize: '14px', margin: 0, maxWidth: '400px' }}>
        Nesto nije u redu. Pokusajte ponovo ili se vratite na pocetnu.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <button
          onClick={reset}
          style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
        >
          Pokusaj ponovo
        </button>
      </div>
    </div>
  );
}
