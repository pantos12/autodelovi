'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          color: '#fff',
          fontSize: '22px',
          fontWeight: 700,
          marginBottom: '8px',
        }}
      >
        Došlo je do greške
      </h2>
      <p
        style={{
          color: '#888',
          fontSize: '14px',
          marginBottom: '24px',
          maxWidth: '400px',
        }}
      >
        Nešto nije u redu. Molimo pokušajte ponovo.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={reset}
          style={{
            padding: '10px 24px',
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
          href="/"
          style={{
            padding: '10px 24px',
            background: '#252629',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Početna
        </a>
      </div>
    </div>
  );
}
