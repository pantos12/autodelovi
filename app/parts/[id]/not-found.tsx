import Link from 'next/link';

export default function PartNotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <span style={{ fontSize: '64px' }}>🔍</span>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Deo nije pronađen</h1>
      <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>
        Ovaj deo ne postoji ili je uklonjen iz ponude.
      </p>
      <Link
        href="/marketplace"
        style={{ marginTop: '12px', padding: '12px 32px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}
      >
        Pretraži marketplace
      </Link>
    </div>
  );
}
