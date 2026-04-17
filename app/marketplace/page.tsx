'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Part } from '@/lib/types';

const STATIC_CATEGORIES = [
  { slug: 'motor', name: 'Motor', icon: '⚙️' },
  { slug: 'kocnice', name: 'Kocnice', icon: '🛑' },
  { slug: 'elektronika', name: 'Elektronika', icon: '⚡' },
  { slug: 'karoserija', name: 'Karoserija', icon: '🚗' },
  { slug: 'suspenzija', name: 'Suspenzija', icon: '🔧' },
  { slug: 'transmisija', name: 'Transmisija', icon: '⚙️' },
  { slug: 'ostalo', name: 'Ostalo', icon: '📦' },
];

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [filterMake, setFilterMake] = useState(searchParams.get('make') || '');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || '');
  const [filterInStock, setFilterInStock] = useState(false);
  const [sortBy, setSortBy] = useState('price_asc');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const perPage = 24;

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      setSearchInput(q);
    }
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [filterMake, filterCategory, filterInStock, sortBy, searchQuery, minPrice, maxPrice]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (searchQuery && searchQuery.length >= 2) {
          const params = new URLSearchParams();
          params.set('q', searchQuery);
          if (filterCategory) params.set('category', filterCategory);
          if (filterInStock) params.set('in_stock', 'true');
          if (minPrice) params.set('min_price', minPrice);
          if (maxPrice) params.set('max_price', maxPrice);
          params.set('page', String(page));
          params.set('per_page', String(perPage));
          const res = await fetch(`/api/search?${params}`);
          const json = await res.json();
          setParts(json.data || []);
          setTotal(json.meta?.total || json.data?.length || 0);
          setTotalPages(json.meta?.total_pages || 1);
        } else {
          const params = new URLSearchParams();
          if (filterMake) params.set('make', filterMake);
          if (filterCategory) params.set('category', filterCategory);
          if (filterInStock) params.set('in_stock', 'true');
          if (minPrice) params.set('min_price', minPrice);
          if (maxPrice) params.set('max_price', maxPrice);
          params.set('sort', sortBy);
          params.set('page', String(page));
          params.set('per_page', String(perPage));
          const res = await fetch(`/api/parts?${params}`);
          const json = await res.json();
          setParts(json.data || []);
          setTotal(json.meta?.total || json.data?.length || 0);
          setTotalPages(json.meta?.total_pages || 1);
        }
      } catch {
        setParts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filterMake, filterCategory, filterInStock, sortBy, searchQuery, page, minPrice, maxPrice]);

  const toggleCompare = (id: string) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  }

  function clearSearch() {
    setSearchQuery('');
    setSearchInput('');
  }

  function applyPriceFilter(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  const activeFilterCount = [filterMake, filterCategory, filterInStock, minPrice, maxPrice, searchQuery].filter(Boolean).length;

  const s = {
    page: { background: '#0c0d0f', minHeight: '100vh' } as React.CSSProperties,
    label: { color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '4px' } as React.CSSProperties,
    select: { width: '100%', padding: '8px 12px', background: '#0c0d0f', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px' } as React.CSSProperties,
    card: { background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden' } as React.CSSProperties,
  };

  const sidebar = (
    <>
      {/* Search input */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <label style={s.label}>Pretraga</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Naziv, broj dela, brend..."
            style={{ ...s.select, flex: 1, padding: '8px 12px' }}
          />
          <button type="submit" style={{ padding: '8px 12px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}>
            🔍
          </button>
        </div>
        {searchQuery && (
          <button type="button" onClick={clearSearch} style={{ marginTop: '8px', background: 'none', border: 'none', color: '#f9372c', fontSize: '12px', cursor: 'pointer', padding: 0 }}>
            ✕ Obriši pretragu: &quot;{searchQuery}&quot;
          </button>
        )}
      </form>

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
          {STATIC_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      {/* Price range filter */}
      <form onSubmit={applyPriceFilter} style={{ marginBottom: '16px' }}>
        <label style={s.label}>Cena (RSD)</label>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <input
            type="number"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            placeholder="Od"
            min={0}
            style={{ ...s.select, width: '50%', padding: '8px 10px' }}
          />
          <span style={{ color: '#555' }}>–</span>
          <input
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            placeholder="Do"
            min={0}
            style={{ ...s.select, width: '50%', padding: '8px 10px' }}
          />
        </div>
      </form>

      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" id="instock" checked={filterInStock} onChange={e => setFilterInStock(e.target.checked)} style={{ accentColor: '#f9372c' }} />
        <label htmlFor="instock" style={{ color: '#aaa', fontSize: '13px', cursor: 'pointer' }}>Samo na stanju</label>
      </div>
      <button onClick={() => { setFilterMake(''); setFilterCategory(''); setFilterInStock(false); setMinPrice(''); setMaxPrice(''); clearSearch(); }} style={{ width: '100%', padding: '8px', background: '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>
        Resetuj sve
      </button>
    </>
  );

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 768px) {
          .marketplace-grid { grid-template-columns: 1fr !important; }
          .marketplace-sidebar { display: none; }
          .marketplace-sidebar.open { display: block; position: fixed; top: 64px; left: 0; right: 0; bottom: 0; z-index: 50; background: #0c0d0f; overflow-y: auto; padding: 20px; }
          .mobile-filter-btn { display: flex !important; }
          .parts-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important; }
        }
      `}</style>

      <div className="marketplace-grid" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        {/* Desktop sidebar */}
        <div className={`marketplace-sidebar${mobileFiltersOpen ? ' open' : ''}`} style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', height: 'fit-content', position: 'sticky', top: '80px' }}>
          {sidebar}
          {mobileFiltersOpen && (
            <button onClick={() => setMobileFiltersOpen(false)} style={{ width: '100%', padding: '12px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600, marginTop: '16px' }}>
              Prikaži {total} rezultata
            </button>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Mobile filter button */}
              <button
                className="mobile-filter-btn"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                style={{ display: 'none', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}
              >
                ☰ Filteri{activeFilterCount > 0 && <span style={{ background: '#f9372c', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>{activeFilterCount}</span>}
              </button>
              <p style={{ color: '#aaa', fontSize: '14px' }}>
                {loading ? 'Učitavanje...' : searchQuery ? `${total} rezultata za "${searchQuery}"` : `${total} delova`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select style={{ ...s.select, width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="price_asc">Cena: niža → viša</option>
                <option value="price_desc">Cena: viša → niža</option>
                <option value="newest">Najnovije</option>
              </select>
              {compareList.length > 0 && (
                <button onClick={() => router.push('/comparison?ids=' + compareList.join(','))} style={{ padding: '8px 16px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>
                  Poredi ({compareList.length})
                </button>
              )}
            </div>
          </div>
          {loading ? (
            <div className="parts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ ...s.card, height: '280px', background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              ))}
            </div>
          ) : (
            <div className="parts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {parts.map(part => {
                const vehicle = part.compatible_vehicles?.[0];
                const inStock = (part.stock_quantity ?? 0) > 0;
                const partUrl = `/parts/${part.slug || part.id}`;
                return (
                  <div key={part.id} style={{ ...s.card, border: compareList.includes(part.id) ? '2px solid #f9372c' : '2px solid transparent', transition: 'border-color 0.2s' }}>
                    <div style={{ background: '#252629', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', overflow: 'hidden' }}>
                      {part.images?.[0] ? <img src={part.images[0]} alt={part.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" /> : '🔧'}
                    </div>
                    <div style={{ padding: '12px' }}>
                      {vehicle && <p style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px' }}>{vehicle.make} {vehicle.model}</p>}
                      <h3 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', lineHeight: '1.3' }}>{part.name_sr || part.name}</h3>
                      <p style={{ color: '#f9372c', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{part.price?.toLocaleString('sr-RS')} RSD</p>
                      <p style={{ color: inStock ? '#22c55e' : '#ef4444', fontSize: '12px', marginBottom: '10px' }}>{inStock ? 'Na stanju' : 'Nema na stanju'}</p>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link href={partUrl} style={{ flex: 1, padding: '8px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', textAlign: 'center', fontSize: '13px' }}>Detalji</Link>
                        <button onClick={() => toggleCompare(part.id)} style={{ padding: '8px', background: compareList.includes(part.id) ? '#f9372c' : '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px', transition: 'background 0.2s' }}>≈</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && parts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '48px' }}>🔍</p>
              <p style={{ fontSize: '18px', color: '#aaa' }}>
                {searchQuery ? `Nema rezultata za "${searchQuery}"` : 'Nema rezultata za date filtere'}
              </p>
              {searchQuery && (
                <button onClick={clearSearch} style={{ marginTop: '16px', padding: '10px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>
                  Obriši pretragu
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '32px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{ padding: '8px 14px', background: page <= 1 ? '#1a1b1f' : '#333', border: 'none', borderRadius: '8px', color: page <= 1 ? '#555' : '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer', fontSize: '13px' }}
              >
                ← Prethodna
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    style={{
                      padding: '8px 12px',
                      background: page === pageNum ? '#f9372c' : '#1a1b1f',
                      border: page === pageNum ? 'none' : '1px solid #333',
                      borderRadius: '8px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: page === pageNum ? 700 : 400,
                      minWidth: '36px',
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                style={{ padding: '8px 14px', background: page >= totalPages ? '#1a1b1f' : '#333', border: 'none', borderRadius: '8px', color: page >= totalPages ? '#555' : '#fff', cursor: page >= totalPages ? 'not-allowed' : 'pointer', fontSize: '13px' }}
              >
                Sledeća →
              </button>
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
