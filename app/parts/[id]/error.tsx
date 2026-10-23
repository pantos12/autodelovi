'use client';

export default function PartError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</p>
        <h2 style={{ color: '#fff', fontSize: '22px', marginBottom: '8px' }}>Deo nije dostupan</h2>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px', maxWidth: '400px' }}>
          Došlo je do greške pri učitavanju ovog dela. Pokušajte ponovo ili se vratite na marketplace.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              padding: '12px 24px',
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
          <a
            href="/marketplace"
            style={{
              padding: '12px 24px',
              background: '#252629',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Marketplace
          </a>
        </div>
      </div>
    </div>
  );
}
