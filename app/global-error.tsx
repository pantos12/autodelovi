'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="sr">
      <body style={{ margin: 0, background: '#0c0d0f', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
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
            Aplikacija je naišla na neočekivanu grešku.
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
              }}
            >
              Početna
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
