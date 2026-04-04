'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockParts, categories } from '../lib/data';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [compareList, setCompareList] = useState<string[]>([]);
  const [filterMake, setFilterMake] = useState(searchParams.get('make') || '');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || '');
  const [filterInStock, setFilterInStock] = useState(false);
  const [sortBy, setSortBy] = useState('price-asc');

  const filteredParts = mockParts.filter(part => {
    if (filterMake && part.make !== filterMake) return false;
    if (filterCategory && part.categorySlug !== filterCategory) return false;
    if (filterInStock && !part.inStock) return false;
    return true;
  }).sort((a, b) => sortBy === 'price-asc' ? a.price - b.price : b.price - a.price);

  const toggleCompare = (id: string) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const s = {
    page: { background: '#0c0d0f', minHeight: '100vh' } as React.CSSProperties,
    container: { maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' } as React.CSSProperties,
    sidebar: { background: '#1a1b1f', borderRadius: '12px', padding: '20px', height: 'fit-content', position: 'sticky', top: '80px' } as React.CSSProperties,
    label: { color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '4px' } as React.CSSProperties,
    select: { width: '100%', padding: '8px 12px', background: '#0c0d0f', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px' } as React.CSSProperties,
    card: { background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden' } as React.CSSProperties,
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.sidebar}>
          <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '16px' }}>Filteri</h3>
          <div style={{ marginBottom: '16px' }}>
            <label style={s.label}>Marka</label>
            <select style={s.select} value={filterMake} onChange={e => setFilterMake(e.target.value)}>
              <option value="">Sve marke</option>
              {['Volkswagen','BMW','Mercedes','Audi','Opel','Renault','Peugeot','Fiat','Toyota','Ford','Skoda','Seat'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={s.label}>Kategorija</label>
            <select style={s.select} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="">Sve kategorije</option>
              {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" id="instock" checked={filterInStock} onChange={e => setFilterInStock(e.target.checked)} style={{ accentColor: '#ff4d00' }} />
            <label htmlFor="instock" style={{ color: '#aaa', fontSize: '13px', cursor: 'pointer' }}>Samo na stanju</label>
          </div>
          <button onClick={() => { setFilterMake(''); setFilterCategory(''); setFilterInStock(false); }} style={{ width: '100%', padding: '8px', background: '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>
            Resetuj filtere
          </button>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p style={{ color: '#aaa', fontSize: '14px' }}>{filteredParts.length} delova</p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select style={{ ...s.select, width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="price-asc">Cena: niža rarr viša</option>
                <option value="price-desc">Cena: viša rarr niža</option>
              </select>
              {compareList.length > 0 && (
                <button onClick={() => router.push('/comparison?ids=' + compareList.join(','))} style={{ padding: '8px 16px', background: '#ff4d00', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>
                  Poredi ({compareList.length})
                </button>
              )}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {filteredParts.map(part => (
              <div key={part.id} style={{ ...s.card, border: compareList.includes(part.id) ? '2px solid #ff4d00' : '2px solid transparent' }}>
                <div style={{ background: '#252629', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>{part.image}</div>
                <div style={{ padding: '12px' }}>
                  <p style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px' }}>{part.make} {part.model}</p>
                  <h3 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', lineHeight: '1.3' }}>{part.nameSr}</h3>
                  <p style={{ color: '#ff4d00', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{part.price.toLocaleString('sr-RS')} RSD</p>
                  <p style={{ color: part.inStock ? '#22c55e' : '#ef4444', fontSize: '12px', marginBottom: '10px' }}>{part.inStock ? 'Na stanju' : 'Nema na stanju'}</p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link href={`/parts/${part.id}`} style={{ flex: 1, padding: '8px', background: '#ff4d00', borderRadius: '8px', color: '#fff', textDecoration: 'none', textAlign: 'center', fontSize: '13px' }}>Detalji</Link>
                    <button onClick={() => toggleCompare(part.id)} style={{ padding: '8px', background: compareList.includes(part.id) ? '#ff4d00' : '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>≈</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredParts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '48px' }}>🔍</p>
              <p style={{ fontSize: '18px', color: '#aaa' }}>Nema rezultata za date filtere</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Marketplace() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#aaa' }}>Učitavanje...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
