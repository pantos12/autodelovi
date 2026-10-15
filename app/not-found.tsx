import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', color: '#fff' }}>
      <p style={{ fontSize: '64px', fontWeight: 800, color: '#f9372c', marginBottom: '8px' }}>404</p>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Stranica nije pronadjena</h2>
      <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px' }}>
        Stranica koju trazite ne postoji ili je uklonjena.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link
          href="/"
          style={{ padding: '10px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}
        >
          Pocetna
        </Link>
        <Link
          href="/marketplace"
          style={{ padding: '10px 24px', background: '#333', border: 'none', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}
        >
          Marketplace
        </Link>
      </div>
    </div>
  );
}
