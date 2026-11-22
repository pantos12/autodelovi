import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      <h1 style={{ color: '#fff', fontSize: '72px', fontWeight: 800, margin: 0 }}>404</h1>
      <p style={{ color: '#aaa', fontSize: '16px', margin: 0 }}>Stranica nije pronadjena</p>
      <Link href="/" style={{ marginTop: '12px', padding: '12px 32px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
        Nazad na pocetnu
      </Link>
    </div>
  );
}
