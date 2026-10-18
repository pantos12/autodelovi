import Link from 'next/link';
import type { Metadata } from 'next';
import HomeSearch from './components/HomeSearch';

export const metadata: Metadata = {
  title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu | Srbija',
  description: 'AutoDelovi.sale je premium marketplace za auto delove u Srbiji. Pretrazite 50,000+ delova od 200+ proverenih dobavljaca. VW, BMW, Mercedes, Audi, Opel i jos mnogo.',
  alternates: { canonical: 'https://autodelovi.sale' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AutoDelovi.sale',
  url: 'https://autodelovi.sale',
  description: 'Premium marketplace za auto delove u Srbiji',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Beograd',
    addressCountry: 'RS',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        @media (max-width: 768px) {
          .hero-title { font-size: 44px !important; }
          .search-bar { flex-direction: column !important; }
          .search-bar select, .search-bar button { width: 100% !important; flex: none !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .categories-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-pad { padding: 48px 16px 40px !important; }
          .section-pad { padding: 0 16px 48px !important; }
        }
        @media (max-width: 480px) {
          .categories-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ background: '#0c0d0f', minHeight: '100vh', color: '#fff', fontFamily: "'Inter','Helvetica Neue',sans-serif", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(249,55,44,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* HERO */}
        <main className="hero-pad" style={{ position: 'relative', zIndex: 5, maxWidth: '900px', margin: '0 auto', padding: '80px 24px 60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(249,55,44,0.1)', border: '1px solid rgba(249,55,44,0.25)', borderRadius: '20px', padding: '6px 16px', marginBottom: '32px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f9372c', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: '#f9372c', textTransform: 'uppercase' }}>Premium Marketplace</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(42px, 8vw, 80px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', display: 'block' }}>SVI DELOVI NA</span>
            <span style={{ color: '#fff', display: 'block' }}>JEDNOM MESTU.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', marginBottom: '40px', maxWidth: '480px', lineHeight: 1.6 }}>
            Agregiramo delimicno skladiste od 50,000+ delova od 200+ proverenih dobavljaca sirom Srbije.
          </p>

          <HomeSearch />
        </main>

        {/* FEATURES */}
        <section className="section-pad" style={{ position: 'relative', zIndex: 5, maxWidth: '900px', margin: '0 auto', padding: '0 24px 60px' }}>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { title: 'Agregirano pretrazivanje', desc: 'Jedan upit, 200+ dobavljaca pretrazeno istovremeno u realnom vremenu.' },
              { title: 'Real-time provera zaliha', desc: 'Live informacije o dostupnosti — bez zastarelih podataka.' },
              { title: 'OE Cross-referencing', desc: 'Automatsko uporedjivanje OEM i aftermarket referenci za svaki deo.' },
            ].map((f, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ width: '32px', height: '2px', background: '#f9372c', marginBottom: '16px', borderRadius: '2px' }} />
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section-pad" style={{ position: 'relative', zIndex: 5, maxWidth: '900px', margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '20px' }}>KATEGORIJE</h2>
          <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px' }}>
            {[
              { slug: 'motor', label: 'MOTOR', icon: '⚙️', count: '1,240', large: true },
              { slug: 'kocnice', label: 'KOCNICE', icon: '🛞', count: '840', large: false },
              { slug: 'elektronika', label: 'ELEKTRONIKA', icon: '⚡', count: '960', large: false },
              { slug: 'karoserija', label: 'KAROSERIJA', icon: '🚗', count: '1,100', large: false },
            ].map(cat => (
              <Link href={'/categories/' + cat.slug} key={cat.slug} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: cat.large ? '28px' : '24px', cursor: 'pointer', height: '100%', transition: 'border-color 0.2s' }}>
                  <div style={{ fontSize: cat.large ? '28px' : '22px', marginBottom: '10px' }}>{cat.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: cat.large ? '16px' : '13px', marginBottom: '6px' }}>{cat.label}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{cat.count} delova</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* POPULAR BRANDS */}
        <section className="section-pad" style={{ position: 'relative', zIndex: 5, maxWidth: '900px', margin: '0 auto', padding: '0 24px 60px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '20px' }}>POPULARNI BRENDOVI</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['BOSCH', 'MANN-FILTER', 'SACHS', 'NGK', 'VALEO', 'TRW', 'LuK', 'ContiTech', 'INA', 'BLIC', 'FEBI', 'MAHLE'].map(brand => (
              <Link
                href={`/marketplace?q=${encodeURIComponent(brand)}`}
                key={brand}
                style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s' }}
              >
                {brand}
              </Link>
            ))}
          </div>
        </section>

        {/* TRUST BANNER */}
        <section style={{ position: 'relative', zIndex: 5, maxWidth: '900px', margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {[
              { icon: '🔒', text: 'Bezbedno placanje' },
              { icon: '🚚', text: 'Besplatna dostava 10.000+ RSD' },
              { icon: '✓', text: 'Verifikovani dobavljaci' },
              { icon: '↩', text: 'Povrat u roku 14 dana' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ position: 'relative', zIndex: 5, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', marginBottom: '32px' }}>
              <div>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', lineHeight: 1.6, marginTop: '12px' }}>Agregiramo 50,000+ delova od 200+ dobavljaca sirom Srbije na jednom mestu.</p>
              </div>
              <div>
                <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Navigacija</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link href="/marketplace" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Marketplace</Link>
                  <Link href="/suppliers" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Dobavljaci</Link>
                  <Link href="/vehicle-selection" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Izbor vozila</Link>
                  <Link href="/comparison" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Poredenje</Link>
                </div>
              </div>
              <div>
                <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Kategorije</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link href="/categories/motor" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Motor</Link>
                  <Link href="/categories/kocnice" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Kocnice</Link>
                  <Link href="/categories/elektronika" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Elektronika</Link>
                  <Link href="/categories/karoserija" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Karoserija</Link>
                </div>
              </div>
              <div>
                <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Kontakt</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href="mailto:info@autodelovi.sale" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>info@autodelovi.sale</a>
                  <a href="mailto:dobavljaci@autodelovi.sale" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Za dobavljace</a>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>&copy; 2026 AutoDelovi.sale &mdash; Sva prava zadrzana</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>Beograd, Srbija</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
