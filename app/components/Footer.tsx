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
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0c0d0f', padding: '40px 24px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff', display: 'block', marginBottom: '12px' }}>
              AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span>
            </span>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6 }}>
              Premium marketplace za auto delove u Srbiji. 50,000+ delova od 200+ dobavljaca.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Navigacija</h4>
            {footerLinks.map(link => (
              <Link key={link.href} href={link.href} style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none', marginBottom: '8px' }}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Kategorije</h4>
            {categories.map(link => (
              <Link key={link.href} href={link.href} style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none', marginBottom: '8px' }}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Kontakt</h4>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '8px' }}>info@autodelovi.sale</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '8px' }}>+381 11 000 0000</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Beograd, Srbija</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>© 2026 AutoDelovi.sale. Sva prava zadrzana.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>Uslovi koriscenja</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>Politika privatnosti</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
