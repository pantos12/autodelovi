import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', background: '#0c0d0f' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
            AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span>
          </span>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '4px' }}>
            Svi auto delovi na jednom mestu.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Link href="/marketplace" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/suppliers" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Dobavljaci</Link>
          <Link href="/comparison" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Poredenje</Link>
          <Link href="/vehicle-selection" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Izbor vozila</Link>
        </div>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
          &copy; {new Date().getFullYear()} AutoDelovi.sale
        </span>
      </div>
    </footer>
  );
}
