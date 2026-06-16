'use client';

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      <p style={{ fontSize: '48px' }}>⚠️</p>
      <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>Greška pri plaćanju</h2>
      <p style={{ color: '#aaa', fontSize: '14px' }}>Došlo je do greške. Vaša kartica nije zadužena.</p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={reset} style={{ padding: '12px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
          Pokušaj ponovo
        </button>
        <a href="/cart" style={{ padding: '12px 24px', background: '#333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Nazad u korpu
        </a>
      </div>
    </div>
  );
}
