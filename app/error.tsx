'use client';
import Link from 'next/link';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '24px', maxWidth: '480px' }}>
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</p>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Došlo je do greške</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
          Nešto nije u redu. Pokušajte ponovo ili se vratite na početnu stranu.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{ padding: '12px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Pokušaj ponovo
          </button>
          <Link href="/" style={{ padding: '12px 24px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Početna strana
          </Link>
        </div>
      </div>
    </div>
  );
}
