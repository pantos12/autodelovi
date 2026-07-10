import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', fontFamily: "Inter, 'Helvetica Neue', sans-serif", padding: '24px', textAlign: 'center' }}>
      <span style={{ fontSize: '64px' }}>🔧</span>
      <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, margin: 0 }}>Stranica nije pronadjena</h1>
      <p style={{ color: '#aaa', fontSize: '15px', margin: 0, maxWidth: '400px' }}>
        Deo koji trazite mozda je premesten ili vise ne postoji.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <Link href="/" style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Pocetna
        </Link>
        <Link href="/marketplace" style={{ padding: '12px 24px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Marketplace
        </Link>
      </div>
    </div>
  );
}
