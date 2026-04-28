import Link from 'next/link';

export default function PartNotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</p>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Deo nije pronađen</h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px' }}>Deo koji tražite ne postoji ili je uklonjen.</p>
        <Link
          href="/marketplace"
          style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}
        >
          Pregledaj marketplace
        </Link>
      </div>
    </div>
  );
}
