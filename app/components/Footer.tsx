import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0a0b0d' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '12px', lineHeight: 1.6 }}>
              Premium marketplace za auto delove u Srbiji. 50,000+ delova od proverenih dobavljaca.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>Navigacija</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/marketplace" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Marketplace</Link>
              <Link href="/suppliers" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Dobavljaci</Link>
              <Link href="/vehicle-selection" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Izbor vozila</Link>
              <Link href="/comparison" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Poredjenje</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>Kategorije</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/categories/motor" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Motor</Link>
              <Link href="/categories/kocnice" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Kocnice</Link>
              <Link href="/categories/elektronika" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Elektronika</Link>
              <Link href="/categories/karoserija" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Karoserija</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>Kontakt</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="mailto:info@autodelovi.sale" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>info@autodelovi.sale</a>
              <a href="mailto:dobavljaci@autodelovi.sale" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Za dobavljace</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>&copy; 2026 AutoDelovi.sale. Sva prava zadrzana.</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>Beograd, Srbija</span>
        </div>
      </div>
    </footer>
  );
}
