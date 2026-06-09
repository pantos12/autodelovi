import Link from 'next/link';

const footerLinks = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/suppliers', label: 'Dobavljaci' },
  { href: '/comparison', label: 'Poredenje' },
  { href: '/vehicle-selection', label: 'Izbor vozila' },
];

const categories = [
  { href: '/categories/motor', label: 'Motor' },
  { href: '/categories/kocnice', label: 'Kocnice' },
  { href: '/categories/elektronika', label: 'Elektronika' },
  { href: '/categories/karoserija', label: 'Karoserija' },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0a0b0d' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff', display: 'block', marginBottom: '12px' }}>
              AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span>
            </span>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, maxWidth: '260px' }}>
              Premium marketplace za auto delove u Srbiji. 50,000+ delova od 200+ proverenih dobavljaca.
            </p>
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Navigacija
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {footerLinks.map(link => (
                <Link key={link.href} href={link.href} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none', transition: 'color 0.15s' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Kategorije
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map(link => (
                <Link key={link.href} href={link.href} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none', transition: 'color 0.15s' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Kontakt
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="mailto:info@autodelovi.sale" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>
                info@autodelovi.sale
              </a>
              <a href="mailto:dobavljaci@autodelovi.sale" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>
                dobavljaci@autodelovi.sale
              </a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>© 2026 AutoDelovi.sale — Sva prava zadrzana</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>Srbija</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
