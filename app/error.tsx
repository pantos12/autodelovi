'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#x26A0;</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Doslo je do greske</h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px', maxWidth: '400px' }}>
          Izvinjavamo se. Pokusajte ponovo ili se vratite na pocetnu stranicu.
        </p>
        <button
          onClick={reset}
          style={{ padding: '12px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
        >
          Pokusaj ponovo
        </button>
      </div>
    </div>
  );
}
