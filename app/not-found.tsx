import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', color: '#fff' }}>
      <h2 style={{ fontSize: '72px', fontWeight: 800, color: '#f9372c', marginBottom: '8px', lineHeight: 1 }}>404</h2>
      <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Stranica nije pronadjena</p>
      <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px' }}>
        Trazena stranica ne postoji ili je uklonjena.
      </p>
      <Link
        href="/"
        style={{ padding: '12px 32px', background: '#f9372c', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
      >
        Nazad na pocetnu
      </Link>
    </div>
  );
}
