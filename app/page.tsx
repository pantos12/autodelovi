import Link from 'next/link';
import type { Metadata } from 'next';
import HomeHero from './components/HomeHero';

export const metadata: Metadata = {
  title: 'AutoDelovi.sale - Svi Auto Delovi na Jednom Mestu',
  description: 'Agregiramo 50,000+ auto delova od 200+ proverenih dobavljaca sirom Srbije. Pretrazite motor, kocnice, elektroniku, karoseriju i jos mnogo toga.',
  alternates: { canonical: 'https://autodelovi.sale' },
};

export default function Home() {
  return (
    <>
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
        <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(249,55,44,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <HomeHero />

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

        <section className="section-pad" style={{ position: 'relative', zIndex: 5, maxWidth: '900px', margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '20px' }}>KATEGORIJE</h2>
          <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px' }}>
            {[
              { slug: 'motor', label: 'MOTOR', icon: '⚙️', large: true },
              { slug: 'kocnice', label: 'KOCNICE', icon: '🛞', large: false },
              { slug: 'elektronika', label: 'ELEKTRONIKA', icon: '⚡', large: false },
              { slug: 'karoserija', label: 'KAROSERIJA', icon: '🚗', large: false },
            ].map(cat => (
              <Link href={'/categories/' + cat.slug} key={cat.slug} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: cat.large ? '28px' : '24px', cursor: 'pointer', height: '100%', transition: 'border-color 0.2s' }}>
                  <div style={{ fontSize: cat.large ? '28px' : '22px', marginBottom: '10px' }}>{cat.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: cat.large ? '16px' : '13px', marginBottom: '6px' }}>{cat.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <footer style={{ position: 'relative', zIndex: 5, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>&copy; 2026 AutoDelovi.sale</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/marketplace" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Marketplace</Link>
            <Link href="/suppliers" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Dobavljaci</Link>
            <Link href="/comparison" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Poredenje</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
