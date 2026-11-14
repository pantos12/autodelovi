'use client';

import Link from 'next/link';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(249,55,44,0.12)', border: '1px solid rgba(249,55,44,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '28px' }}>
          !
        </div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
          Došlo je do greške
        </h1>
        <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
          Nešto je pošlo naopako. Pokušajte ponovo ili se vratite na početnu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ padding: '12px 28px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Pokušaj ponovo
          </button>
          <Link
            href="/"
            style={{ padding: '12px 28px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}
          >
            Početna
          </Link>
        </div>
      </div>
    </div>
  );
}
