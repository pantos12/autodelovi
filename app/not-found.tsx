import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ fontSize: '72px', fontWeight: 800, color: '#f9372c', marginBottom: '8px' }}>404</div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Stranica nije pronađena</h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '32px', lineHeight: 1.5 }}>
          Deo koji tražite možda je uklonjen ili promenjen. Pretražite marketplace za sve dostupne delove.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/marketplace"
            style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            Pretraži delove
          </Link>
          <Link
            href="/"
            style={{ padding: '12px 24px', background: '#252629', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            Početna stranica
          </Link>
        </div>
      </div>
    </div>
  );
}
