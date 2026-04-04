'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { mockParts, vehicleMakes, getModels, categories, Part } from '../lib/data';

export default function Marketplace() {
  const searchParams = useSearchParams();
  const [filterMake, setFilterMake] = useState(searchParams.get('make') || '');
  const [filterModel, setFilterModel] = useState(searchParams.get('model') || '');
  const [filterCat, setFilterCat] = useState(searchParams.get('category') || '');
  const [filterStock, setFilterStock] = useState(false);
  const [search, setSearch] = useState('');
  const [compareList, setCompareList] = useState<string[]>([]);

  const models = getModels(filterMake);

  const filtered = mockParts.filter(p => {
    if (filterMake && p.make !== filterMake) return false;
    if (filterModel && p.model !== filterModel) return false;
    if (filterCat && p.categorySlug !== filterCat) return false;
    if (filterStock && !p.inStock) return false;
    if (search && !p.nameSr.toLowerCase().includes(search.toLowerCase()) && !p.oem.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function toggleCompare(id: string) {
    setCompareList(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  }

  const bg = '#0c0d0f';
  const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' } as React.CSSProperties;

  return (
    <div style={{ background: bg, minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: '64px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(12,13,15,0.95)', backdropFilter: 'blur(12px)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link href="/marketplace" style={{ color: '#f9372c', fontWeight: 600, fontSize: '13px', letterSpacing: '1px', textDecoration: 'none', borderBottom: '2px solid #f9372c', paddingBottom: '2px' }}>MARKETPLACE</Link>
          <Link href="/suppliers" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>DOBAVLJACI</Link>
          <Link href="/vehicle-selection" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>IZBOR VOZILA</Link>
          <Link href="/comparison" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>POREDENJE</Link>
        </div>
      </nav>

      <div style={{ display: 'flex', maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', gap: '24px' }}>
        {/* SIDEBAR */}
        <aside style={{ width: '260px', flexShrink: 0 }}>
          <div style={{ ...card, padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', textTransform: 'uppercase' }}>Pretraga</h3>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Naziv ili OEM broj..." style={{ width: '100%', background: '#1a1c1e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ ...card, padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', textTransform: 'uppercase' }}>Vozilo</h3>
            <select value={filterMake} onChange={e => { setFilterMake(e.target.value); setFilterModel(''); }} style={{ width: '100%', background: '#1a1c1e', border: '1px solid rgba(255,255,255,0.1)', color: filterMake ? '#fff' : '#888', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '10px', outline: 'none', boxSizing: 'border-box' }}>
              <option value="">Sve marke</option>
              {vehicleMakes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={filterModel} onChange={e => setFilterModel(e.target.value)} disabled={!filterMake} style={{ width: '100%', background: '#1a1c1e', border: '1px solid rgba(255,255,255,0.1)', color: filterModel ? '#fff' : '#888', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}>
              <option value="">Svi modeli</option>
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div style={{ ...card, padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', textTransform: 'uppercase' }}>Kategorija</h3>
            {categories.map(cat => (
              <button key={cat.slug} onClick={() => setFilterCat(filterCat === cat.slug ? '' : cat.slug)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px', marginBottom: '6px', border: 'none', background: filterCat === cat.slug ? 'rgba(249,55,44,0.15)' : 'transparent', color: filterCat === cat.slug ? '#f9372c' : 'rgba(255,255,255,0.65)', fontSize: '13px', cursor: 'pointer' }}>
                {cat.name} <span style={{ float: 'right', color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>{cat.count}</span>
              </button>
            ))}
          </div>
          <div style={{ ...card, padding: '16px 20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
              <input type="checkbox" checked={filterStock} onChange={e => setFilterStock(e.target.checked)} style={{ accentColor: '#f9372c', width: '16px', height: '16px' }} />
              Samo na stanju
            </label>
          </div>
          {compareList.length > 0 && (
            <Link href={'/comparison?ids=' + compareList.join(',')} style={{ textDecoration: 'none' }}>
              <button style={{ marginTop: '16px', width: '100%', background: '#f9372c', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Uporedi ({compareList.length})
              </button>
            </Link>
          )}
        </aside>

        {/* PARTS GRID */}
        <main style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700 }}>Marketplace</h1>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{filtered.length} delova</span>
          </div>
          {filtered.length === 0 ? (
            <div style={{ ...card, padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔍</div>
              <p>Nema delova koji odgovaraju filteru</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {filtered.map(part => (
                <div key={part.id} style={{ ...card, padding: '20px', position: 'relative', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,55,44,0.3)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: '#f9372c', textTransform: 'uppercase', background: 'rgba(249,55,44,0.1)', padding: '3px 8px', borderRadius: '4px' }}>{part.category}</span>
                    <span style={{ fontSize: '11px', color: part.inStock ? '#4ade80' : '#f87171', fontWeight: 600 }}>{part.inStock ? '● Na stanju' : '● Nije dostupno'}</span>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{part.nameSr}</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>{part.make} {part.model} ({part.yearFrom}–{part.yearTo})</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', lineHeight: 1.5 }}>{part.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>{part.price.toLocaleString('sr-RS')} RSD</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>OEM: {part.oem}</div>
                    </div>
                    <button onClick={() => toggleCompare(part.id)} style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, border: '1px solid', cursor: 'pointer', background: compareList.includes(part.id) ? 'rgba(249,55,44,0.15)' : 'transparent', color: compareList.includes(part.id) ? '#f9372c' : 'rgba(255,255,255,0.5)', borderColor: compareList.includes(part.id) ? '#f9372c' : 'rgba(255,255,255,0.15)' }}>
                      {compareList.includes(part.id) ? '✓ Uporedjujem' : '+ Upored.'}
                    </button>
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>📦 {part.supplier}</div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
