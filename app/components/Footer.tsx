import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px 24px', background: '#0c0d0f' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24, marginBottom: 24 }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 8, lineHeight: 1.5 }}>
              Svi auto delovi na jednom mestu. 50,000+ delova od 200+ dobavljača.
            </p>
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Navigacija</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Link href="/marketplace" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>Marketplace</Link>
              <Link href="/suppliers" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>Dobavljači</Link>
              <Link href="/vehicle-selection" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>Izbor vozila</Link>
              <Link href="/comparison" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>Poređenje</Link>
            </div>
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Podrška</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Link href="/cart" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>Korpa</Link>
              <a href="mailto:info@autodelovi.sale" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>Kontakt</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>© 2026 AutoDelovi.sale</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Srbija</span>
        </div>
      </div>
    </footer>
  );
}
