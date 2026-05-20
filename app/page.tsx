import type { Metadata } from 'next';
import Link from 'next/link';
import HomeSearch from './components/HomeSearch';

export const metadata: Metadata = {
  title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu | Srbija',
  description: 'Agregiramo 50,000+ auto delova od 200+ proverenih dobavljaca sirom Srbije. Pretrazite po brendu, broju dela ili vozilu. VW, BMW, Mercedes, Audi, Opel.',
  alternates: { canonical: 'https://autodelovi.sale' },
};

const CATEGORIES = [
  { slug: 'motor', label: 'MOTOR', icon: '⚙️', desc: 'Delovi motora, filteri ulja, remeni' },
  { slug: 'kocnice', label: 'KOCNICE', icon: '🛞', desc: 'Diskovi, plocice, kocione cevi' },
  { slug: 'elektronika', label: 'ELEKTRONIKA', icon: '⚡', desc: 'Senzori, alternatori, razvodnici' },
  { slug: 'karoserija', label: 'KAROSERIJA', icon: '🚗', desc: 'Branici, blatobrani, retrovizori' },
  { slug: 'suspenzija', label: 'SUSPENZIJA', icon: '🔧', desc: 'Amortizeri, opruge, spone' },
  { slug: 'transmisija', label: 'TRANSMISIJA', icon: '⚙️', desc: 'Kvacila, menjaci, kardani' },
];

const FEATURES = [
  { title: 'Agregirano pretrazivanje', desc: 'Jedan upit, 200+ dobavljaca pretrazeno istovremeno u realnom vremenu.' },
  { title: 'Real-time provera zaliha', desc: 'Live informacije o dostupnosti sa pouzdanim indikatorima stanja.' },
  { title: 'OE Cross-referencing', desc: 'Automatsko uporedjivanje OEM i aftermarket referenci za svaki deo.' },
];

const TRUST_ITEMS = [
  { value: '200+', label: 'Proverenih dobavljaca' },
  { value: '50K+', label: 'Auto delova' },
  { value: '15+', label: 'Gradova u Srbiji' },
  { value: '24/7', label: 'Online pristup' },
];

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AutoDelovi.sale',
    url: 'https://autodelovi.sale',
    description: 'Premium marketplace za auto delove u Srbiji',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://autodelovi.sale/marketplace?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

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
          .trust-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .categories-grid { grid-template-columns: 1fr !important; }
        }
        .cat-card { transition: border-color 0.2s, transform 0.2s; }
        .cat-card:hover { border-color: rgba(249,55,44,0.4) !important; transform: translateY(-2px); }
      `}</style>

      <div style={{ background: '#0c0d0f', minHeight: '100vh', color: '#fff', fontFamily: "'Inter','Helvetica Neue',sans-serif", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(249,55,44,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

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

        {/* TRUST NUMBERS */}
        <section className="section-pad" style={{ position: 'relative', zIndex: 5, maxWidth: '900px', margin: '0 auto', padding: '0 24px 48px' }}>
          <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
            {TRUST_ITEMS.map(item => (
              <div key={item.label} style={{ padding: '20px 12px' }}>
                <div style={{ color: '#f9372c', fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>{item.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 500 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="section-pad" style={{ position: 'relative', zIndex: 5, maxWidth: '900px', margin: '0 auto', padding: '0 24px 60px' }}>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ width: '32px', height: '2px', background: '#f9372c', marginBottom: '16px', borderRadius: '2px' }} />
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section-pad" style={{ position: 'relative', zIndex: 5, maxWidth: '900px', margin: '0 auto', padding: '0 24px 60px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '20px' }}>KATEGORIJE</h2>
          <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {CATEGORIES.map(cat => (
              <Link href={'/categories/' + cat.slug} key={cat.slug} style={{ textDecoration: 'none' }}>
                <div className="cat-card" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', cursor: 'pointer', height: '100%' }}>
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>{cat.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{cat.label}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{cat.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section-pad" style={{ position: 'relative', zIndex: 5, maxWidth: '900px', margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '20px' }}>KAKO FUNKCIONISE</h2>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { step: '01', title: 'Pretrazite', desc: 'Unesite naziv dela, OEM broj ili izaberite vozilo iz padajuceg menija.' },
              { step: '02', title: 'Uporedite', desc: 'Pregledajte cene i dostupnost od vise dobavljaca na jednom mestu.' },
              { step: '03', title: 'Porucite', desc: 'Dodajte u korpu i bezbedno platite karticom preko Stripe platforme.' },
            ].map(item => (
              <div key={item.step} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ color: '#f9372c', fontSize: '24px', fontWeight: 800, marginBottom: '12px', fontFamily: 'monospace' }}>{item.step}</div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ position: 'relative', zIndex: 5, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginTop: '8px', maxWidth: '280px', lineHeight: 1.5 }}>
                  Premium marketplace za auto delove u Srbiji.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>Navigacija</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link href="/marketplace" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Marketplace</Link>
                    <Link href="/suppliers" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Dobavljaci</Link>
                    <Link href="/vehicle-selection" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Izbor vozila</Link>
                    <Link href="/comparison" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Poredenje cena</Link>
                  </div>
                </div>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>Kontakt</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <a href="mailto:info@autodelovi.sale" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>info@autodelovi.sale</a>
                    <a href="mailto:dobavljaci@autodelovi.sale" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Za dobavljace</a>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>&copy; 2026 AutoDelovi.sale. Sva prava zadrzana.</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>Bezbedno placanje preko Stripe platforme</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
