import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '32px 24px',
      background: '#0c0d0f',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '32px',
      }}>
        <div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
            AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span>
          </span>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '8px', lineHeight: 1.6 }}>
            Agregiramo 50,000+ delova od 200+ proverenih dobavljaca sirom Srbije.
          </p>
        </div>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Navigacija</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/marketplace" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Marketplace</Link>
            <Link href="/suppliers" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Dobavljaci</Link>
            <Link href="/comparison" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Poredenje</Link>
            <Link href="/vehicle-selection" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Izbor vozila</Link>
          </div>
        </div>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Kategorije</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/categories/motor" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Motor</Link>
            <Link href="/categories/kocnice" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Kocnice</Link>
            <Link href="/categories/elektronika" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Elektronika</Link>
            <Link href="/categories/karoserija" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Karoserija</Link>
          </div>
        </div>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Kontakt</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="mailto:info@autodelovi.sale" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>info@autodelovi.sale</a>
            <a href="mailto:dobavljaci@autodelovi.sale" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Za dobavljace</a>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '24px auto 0', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>&copy; 2026 AutoDelovi.sale</span>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>Svi auto delovi na jednom mestu</span>
      </div>
    </footer>
  );
}
