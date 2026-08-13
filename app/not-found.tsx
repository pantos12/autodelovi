import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px', fontFamily: "var(--font-inter, 'Inter','Helvetica Neue',sans-serif)" }}>
      <span style={{ fontSize: '64px' }}>404</span>
      <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Stranica nije pronadjena</h1>
      <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>Trazena stranica ne postoji ili je premestena.</p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <Link href="/" style={{ padding: '12px 24px', background: '#f9372c', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
          Pocetna
        </Link>
        <Link href="/marketplace" style={{ padding: '12px 24px', background: '#252629', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
          Marketplace
        </Link>
      </div>
    </div>
  );
}
