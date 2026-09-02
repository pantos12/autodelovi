import type { Metadata } from 'next';
import Link from 'next/link';
import HomeSearch from './components/HomeSearch';

export const metadata: Metadata = {
  title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu | Srbija',
  description:
    'AutoDelovi.sale je premium marketplace za auto delove u Srbiji. Pretrazite 50,000+ delova od 200+ proverenih dobavljaca. VW, BMW, Mercedes, Audi, Opel i jos mnogo.',
  openGraph: {
    title: 'AutoDelovi.sale - Premium Auto Delovi Srbija',
    description:
      'Agregiramo delimicno skladiste od 50,000+ auto delova od 200+ proverenih dobavljaca sirom Srbije.',
    url: 'https://autodelovi.sale',
  },
};

const categories = [
  { slug: 'motor', label: 'MOTOR', icon: '⚙️', count: '1,240', large: true },
  { slug: 'kocnice', label: 'KOCNICE', icon: '🛞', count: '840', large: false },
  { slug: 'elektronika', label: 'ELEKTRONIKA', icon: '⚡', count: '960', large: false },
  { slug: 'karoserija', label: 'KAROSERIJA', icon: '🚗', count: '1,100', large: false },
];

const features = [
  { title: 'Agregirano pretrazivanje', desc: 'Jedan upit, 200+ dobavljaca pretrazeno istovremeno u realnom vremenu.' },
  { title: 'Real-time provera zaliha', desc: 'Live informacije o dostupnosti — bez zastarelih podataka.' },
  { title: 'OE Cross-referencing', desc: 'Automatsko uporedjivanje OEM i aftermarket referenci za svaki deo.' },
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
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://autodelovi.sale/marketplace?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="home-page">
        <div className="home-dot-grid" />
        <div className="home-glow" />

        {/* HERO */}
        <main className="hero-pad">
          <div className="home-badge">
            <span className="home-badge-dot" />
            <span className="home-badge-text">Premium Marketplace</span>
          </div>
          <h1 className="hero-title">
            <span className="hero-title-dim">SVI DELOVI NA</span>
            <span className="hero-title-bright">JEDNOM MESTU.</span>
          </h1>
          <p className="hero-subtitle">
            Agregiramo delimicno skladiste od 50,000+ delova od 200+ proverenih dobavljaca sirom Srbije.
          </p>

          <HomeSearch />
        </main>

        {/* FEATURES */}
        <section className="section-pad">
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-accent" />
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section-pad" style={{ paddingBottom: '80px' }}>
          <h2 className="section-heading">KATEGORIJE</h2>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link href={'/categories/' + cat.slug} key={cat.slug} className="category-link">
                <div className={`category-card ${cat.large ? 'category-card-lg' : ''}`}>
                  <div className="category-icon" style={{ fontSize: cat.large ? '28px' : '22px' }}>{cat.icon}</div>
                  <div className="category-label" style={{ fontSize: cat.large ? '16px' : '13px' }}>{cat.label}</div>
                  <div className="category-count">{cat.count} delova</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="home-footer">
          <span className="footer-copy">&copy; 2026 AutoDelovi.sale</span>
          <div className="footer-links">
            <Link href="/marketplace" className="footer-link">Marketplace</Link>
            <Link href="/suppliers" className="footer-link">Dobavljaci</Link>
            <Link href="/comparison" className="footer-link">Poredenje</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
