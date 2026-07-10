'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', fontFamily: "Inter, 'Helvetica Neue', sans-serif", padding: '24px', textAlign: 'center' }}>
      <span style={{ fontSize: '64px' }}>⚠️</span>
      <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, margin: 0 }}>Doslo je do greske</h1>
      <p style={{ color: '#aaa', fontSize: '15px', margin: 0, maxWidth: '400px' }}>
        Nesto nije u redu. Pokusajte ponovo ili se vratite na pocetnu stranicu.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <button onClick={reset} style={{ padding: '12px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
          Pokusaj ponovo
        </button>
        <a href="/" style={{ padding: '12px 24px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Pocetna
        </a>
      </div>
    </div>
  );
}
