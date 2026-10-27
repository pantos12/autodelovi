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
        gap: '24px',
      }}>
        <div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
            AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span>
          </span>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '8px', lineHeight: 1.5 }}>
            Agregiramo 50,000+ auto delova od proverenih dobavljaca sirom Srbije.
          </p>
        </div>

        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Navigacija
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Link href="/marketplace" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Marketplace</Link>
            <Link href="/suppliers" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Dobavljaci</Link>
            <Link href="/vehicle-selection" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Izbor vozila</Link>
            <Link href="/comparison" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Poredenje</Link>
          </div>
        </div>

        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Kategorije
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Link href="/categories/motor" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Motor</Link>
            <Link href="/categories/kocnice" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Kocnice</Link>
            <Link href="/categories/elektronika" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Elektronika</Link>
            <Link href="/categories/karoserija" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Karoserija</Link>
          </div>
        </div>

        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Kontakt
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <a href="mailto:info@autodelovi.sale" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>info@autodelovi.sale</a>
            <a href="mailto:dobavljaci@autodelovi.sale" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Za dobavljace</a>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '20px auto 0',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
          &copy; 2026 AutoDelovi.sale — Sva prava zadrzana.
        </span>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
          Beograd, Srbija
        </span>
      </div>
    </footer>
  );
}
