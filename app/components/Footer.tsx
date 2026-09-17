import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px 24px', background: '#0c0d0f' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '24px' }}>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', maxWidth: '280px', lineHeight: 1.6, marginTop: '8px' }}>
              Premium marketplace za auto delove u Srbiji.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Navigacija</span>
              <Link href="/marketplace" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Marketplace</Link>
              <Link href="/suppliers" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Dobavljaci</Link>
              <Link href="/vehicle-selection" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Izbor vozila</Link>
              <Link href="/comparison" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Poredenje</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Kategorije</span>
              <Link href="/categories/motor" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Motor</Link>
              <Link href="/categories/kocnice" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Kocnice</Link>
              <Link href="/categories/elektronika" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Elektronika</Link>
              <Link href="/categories/karoserija" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Karoserija</Link>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>&copy; {new Date().getFullYear()} AutoDelovi.sale</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>Sva prava zadrzana</span>
        </div>
      </div>
    </footer>
  );
}
