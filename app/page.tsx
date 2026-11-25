'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { vehicleMakes, getModels, getEngines, getYears } from './lib/data';

export default function Home() {
  const router = useRouter();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engine, setEngine] = useState('');
  const [textSearch, setTextSearch] = useState('');

  const models = getModels(make);
  const engines = getEngines(make, model);
  const years = getYears();

  function handleSearch() {
    const params = new URLSearchParams();
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    if (year) params.set('year', year);
    if (engine) params.set('engine', engine);
    router.push('/marketplace?' + params.toString());
  }

  const sel: React.CSSProperties = {
    background: '#1a1c1e',
    border: '1px solid #2a2c2e',
    color: '#888',
    padding: '0 16px',
    height: '48px',
    borderRadius: '8px',
    fontSize: '14px',
    flex: 1,
    minWidth: '120px',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
  };

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

      <div style={{ background: '#0c0d0f', minHeight: '100vh', color: '#fff', position: 'relative', overflow: 'hidden' }}>
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

          {/* TEXT SEARCH */}
          <form onSubmit={e => { e.preventDefault(); if (textSearch.trim().length >= 2) router.push('/marketplace?q=' + encodeURIComponent(textSearch.trim())); }} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
              <input
                type="text"
                value={textSearch}
                onChange={e => setTextSearch(e.target.value)}
                placeholder="Pretrazi po nazivu, broju dela, brendu..."
                style={{ flex: 1, padding: '14px 16px', background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '14px 24px', background: '#f9372c', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', letterSpacing: '1px' }}>
                PRETRAZI
              </button>
            </div>
          </form>

          {/* VEHICLE SEARCH */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Ili izaberite vozilo</p>
            <div className="search-bar" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={make} onChange={e => { setMake(e.target.value); setModel(''); setEngine(''); }} style={{ ...sel, color: make ? '#fff' : '#888' }}>
                <option value="">MARKA</option>
                {vehicleMakes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={model} onChange={e => { setModel(e.target.value); setEngine(''); }} style={{ ...sel, color: model ? '#fff' : '#888' }} disabled={!make}>
                <option value="">MODEL</option>
                {models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={year} onChange={e => setYear(e.target.value)} style={{ ...sel, color: year ? '#fff' : '#888' }}>
                <option value="">GODISTE</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={engine} onChange={e => setEngine(e.target.value)} style={{ ...sel, color: engine ? '#fff' : '#888' }} disabled={!model}>
                <option value="">MOTOR</option>
                {engines.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <button onClick={handleSearch} style={{ background: '#f9372c', color: '#fff', border: 'none', padding: '0 32px', height: '48px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', flexShrink: 0 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#e02a20')}
                onMouseLeave={e => (e.currentTarget.style.background = '#f9372c')}>
                PRETRAGA
              </button>
            </div>
          </div>
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
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: cat.large ? '28px' : '24px', cursor: 'pointer', height: '100%', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,55,44,0.4)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)')}>
                  <div style={{ fontSize: cat.large ? '28px' : '22px', marginBottom: '10px' }}>{cat.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: cat.large ? '16px' : '13px', marginBottom: '6px' }}>{cat.label}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{cat.count} delova</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ position: 'relative', zIndex: 5, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>© 2026 AutoDelovi.sale</span>
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
