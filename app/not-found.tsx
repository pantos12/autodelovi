import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      <div style={{ fontSize: '64px', fontWeight: 800, color: '#f9372c' }}>404</div>
      <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0, textAlign: 'center' }}>
        Stranica nije pronadjena
      </h1>
      <p style={{ color: '#aaa', fontSize: '14px', margin: 0, textAlign: 'center', maxWidth: '400px' }}>
        Stranica koju trazite ne postoji ili je premeshtena.
      </p>
      <Link
        href="/"
        style={{ marginTop: '8px', padding: '12px 32px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}
      >
        Pocetna stranica
      </Link>
    </div>
  );
}
