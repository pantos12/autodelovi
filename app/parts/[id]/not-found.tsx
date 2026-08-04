import Link from 'next/link';

export default function PartNotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px', textAlign: 'center' }}>
      <span style={{ fontSize: '64px' }}>🔧</span>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: 0 }}>Deo nije pronađen</h1>
      <p style={{ color: '#aaa', fontSize: '15px', margin: 0 }}>
        Ovaj deo više nije dostupan ili je uklonjen iz ponude.
      </p>
      <Link href="/marketplace" style={{ marginTop: '12px', padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
        Nazad na marketplace
      </Link>
    </div>
  );
}
