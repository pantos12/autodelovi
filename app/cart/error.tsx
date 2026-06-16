'use client';

export default function CartError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      <p style={{ fontSize: '48px' }}>🛒</p>
      <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>Greška pri učitavanju korpe</h2>
      <p style={{ color: '#aaa', fontSize: '14px' }}>Pokušajte ponovo.</p>
      <button onClick={reset} style={{ padding: '12px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
        Pokušaj ponovo
      </button>
    </div>
  );
}
