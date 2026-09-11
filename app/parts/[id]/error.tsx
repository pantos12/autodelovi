'use client';

import Link from 'next/link';

export default function PartError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Greška pri učitavanju dela</h2>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px' }}>
          Deo trenutno nije dostupan. Pokušajte ponovo ili se vratite na marketplace.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            style={{ padding: '10px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Pokušaj ponovo
          </button>
          <Link
            href="/marketplace"
            style={{ padding: '10px 24px', background: '#252629', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
