'use client';

export default function MarketplaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</p>
        <h2 style={{ color: '#fff', fontSize: '22px', marginBottom: '8px' }}>Greška pri učitavanju</h2>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px', maxWidth: '400px' }}>
          Došlo je do greške pri učitavanju marketplace-a. Pokušajte ponovo.
        </p>
        <button
          onClick={reset}
          style={{
            padding: '12px 32px',
            background: '#f9372c',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Pokušaj ponovo
        </button>
      </div>
    </div>
  );
}
