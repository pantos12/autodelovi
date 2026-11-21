import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', background: '#0c0d0f' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '8px', maxWidth: '280px', lineHeight: 1.5 }}>
            Premium marketplace za auto delove u Srbiji. 50,000+ delova od 200+ proverenih dobavljača.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Navigacija</span>
            <Link href="/marketplace" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Marketplace</Link>
            <Link href="/suppliers" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Dobavljači</Link>
            <Link href="/vehicle-selection" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Izbor vozila</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Podrška</span>
            <Link href="/comparison" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Poređenje</Link>
            <a href="mailto:info@autodelovi.sale" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Kontakt</a>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '20px auto 0', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>© 2026 AutoDelovi.sale — Sva prava zadržana</span>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>Beograd, Srbija</span>
      </div>
    </footer>
  );
}
