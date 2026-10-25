import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <p style={{ fontSize: '72px', marginBottom: '16px' }}>404</p>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Stranica nije pronađena</h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px' }}>Tražena stranica ne postoji ili je premeštena.</p>
        <Link href="/" style={{ display: 'inline-block', padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Nazad na početnu
        </Link>
      </div>
    </div>
  );
}
