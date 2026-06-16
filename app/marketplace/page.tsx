'use client';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Part } from '@/lib/types';
import type { Band } from '@/lib/confidence';
import PartCard from '@/app/components/PartCard';

const STATIC_CATEGORIES = [
  { slug: 'motor', name: 'Motor', icon: '⚙️' },
  { slug: 'kocnice', name: 'Kocnice', icon: '🛑' },
  { slug: 'elektronika', name: 'Elektronika', icon: '⚡' },
  { slug: 'karoserija', name: 'Karoserija', icon: '🚗' },
  { slug: 'suspenzija', name: 'Suspenzija', icon: '🔧' },
  { slug: 'transmisija', name: 'Transmisija', icon: '⚙️' },
  { slug: 'ostalo', name: 'Ostalo', icon: '📦' },
];

const PER_PAGE = 24;

function bandForPart(part: Part): Band {
  if ((part.stock_quantity ?? 0) > 0) return 'verified';
  return 'inquiry';
}

const S = {
  page: { background: '#0c0d0f', minHeight: '100vh' } as React.CSSProperties,
  sidebar: { background: '#1a1b1f', borderRadius: '12px', padding: '20px', height: 'fit-content', position: 'sticky', top: '80px' } as React.CSSProperties,
  label: { color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '4px' } as React.CSSProperties,
  select: { width: '100%', padding: '8px 12px', background: '#0c0d0f', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px' } as React.CSSProperties,
  shimmer: { height: '280px', background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '12px' } as React.CSSProperties,
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' } as React.CSSProperties,
} as const;

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [filterMake, setFilterMake] = useState(searchParams.get('make') || '');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || '');
  const [filterInStock, setFilterInStock] = useState(false);
  const [sortBy, setSortBy] = useState('price_asc');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [availOnly, setAvailOnly] = useState(searchParams.get('avail') === '1');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get('page') || '1');
    return Number.isFinite(p) && p > 0 ? p : 1;
  });

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      setSearchInput(q);
    }
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (searchQuery && searchQuery.length >= 2) {
          const params = new URLSearchParams();
          params.set('q', searchQuery);
          if (filterCategory) params.set('category', filterCategory);
          if (filterInStock) params.set('in_stock', 'true');
          params.set('per_page', String(PER_PAGE));
          params.set('page', String(page));
          const res = await fetch(`/api/search?${params}`);
          const json = await res.json();
          setParts(json.data || []);
          setTotal(json.meta?.total || json.data?.length || 0);
        } else {
          const params = new URLSearchParams();
          if (filterMake) params.set('make', filterMake);
          if (filterCategory) params.set('category', filterCategory);
          if (filterInStock) params.set('in_stock', 'true');
          params.set('sort', sortBy);
          params.set('per_page', String(PER_PAGE));
          params.set('page', String(page));
          const res = await fetch(`/api/parts?${params}`);
          const json = await res.json();
          setParts(json.data || []);
          setTotal(json.meta?.total || json.data?.length || 0);
        }
      } catch {
        setParts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filterMake, filterCategory, filterInStock, sortBy, searchQuery, page]);

  useEffect(() => {
    setPage(1);
  }, [filterMake, filterCategory, filterInStock, sortBy, searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (availOnly) params.set('avail', '1');
    else params.delete('avail');
    const qs = params.toString();
    router.replace(qs ? `/marketplace?${qs}` : '/marketplace', { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availOnly]);

  const toggleCompare = useCallback((id: string) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  }

  function clearSearch() {
    setSearchQuery('');
    setSearchInput('');
  }

  function clearAllFilters() {
    setFilterMake('');
    setFilterCategory('');
    setFilterInStock(false);
    setAvailOnly(false);
    clearSearch();
  }

  const displayParts = availOnly
    ? parts.filter(p => {
        const b = bandForPart(p);
        return b === 'verified' || b === 'likely';
      })
    : parts;

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  function pageNumbers(): number[] {
    const out: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    const realStart = Math.max(1, end - 4);
    for (let i = realStart; i <= end; i++) out.push(i);
    return out;
  }

  const activeFilterCount = [filterMake, filterCategory, filterInStock, availOnly, searchQuery].filter(Boolean).length;

  const filterSidebar = (
    <aside aria-label="Filteri">
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <label htmlFor="marketplace-search" style={S.label}>Pretraga</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            id="marketplace-search"
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Naziv, broj dela, brend..."
            style={{ ...S.select, flex: 1, padding: '8px 12px' }}
          />
          <button type="submit" aria-label="Pretraži" style={{ padding: '8px 12px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}>
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
        <label style={S.label}>Dostupnost</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ddd', fontSize: '13px', cursor: 'pointer' }}>
            <input type="radio" name="avail" checked={!availOnly} onChange={() => setAvailOnly(false)} style={{ accentColor: '#ff4d00' }} />
            Sve ponude
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ddd', fontSize: '13px', cursor: 'pointer' }}>
            <input type="radio" name="avail" checked={availOnly} onChange={() => setAvailOnly(true)} style={{ accentColor: '#ff4d00' }} />
            Samo dostupno
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="filter-make" style={S.label}>Marka</label>
        <select id="filter-make" style={S.select} value={filterMake} onChange={e => setFilterMake(e.target.value)}>
          <option value="">Sve marke</option>
          {['Volkswagen','BMW','Mercedes','Audi','Opel','Renault','Peugeot','Fiat','Toyota','Ford','Skoda','Seat'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="filter-category" style={S.label}>Kategorija</label>
        <select id="filter-category" style={S.select} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">Sve kategorije</option>
          {STATIC_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" id="instock" checked={filterInStock} onChange={e => setFilterInStock(e.target.checked)} style={{ accentColor: '#ff4d00' }} />
        <label htmlFor="instock" style={{ color: '#aaa', fontSize: '13px', cursor: 'pointer' }}>Samo na stanju</label>
      </div>
      <button onClick={clearAllFilters} style={{ width: '100%', padding: '8px', background: '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>
        Resetuj sve
      </button>
    </aside>
  );

  return (
    <div style={S.page}>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @media (max-width: 768px) {
          .marketplace-container { grid-template-columns: 1fr !important; }
          .marketplace-sidebar { display: none; }
          .marketplace-sidebar.open { display: block; position: fixed; top: 64px; left: 0; right: 0; bottom: 0; z-index: 50; background: #0c0d0f; padding: 20px; overflow-y: auto; }
          .mobile-filter-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-filter-btn { display: none !important; }
        }
      `}</style>
      <div className="marketplace-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        {/* Mobile filter toggle */}
        <button
          className="mobile-filter-btn"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          style={{ display: 'none', alignItems: 'center', justifyContent: 'center', gap: '8px', gridColumn: '1 / -1', padding: '12px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
        >
          <span>Filteri</span>
          {activeFilterCount > 0 && (
            <span style={{ background: '#f9372c', color: '#fff', fontSize: '11px', borderRadius: '10px', padding: '2px 8px', fontWeight: 700 }}>{activeFilterCount}</span>
          )}
        </button>

        <div className={`marketplace-sidebar ${mobileFiltersOpen ? 'open' : ''}`} style={S.sidebar}>
          {mobileFiltersOpen && (
            <button onClick={() => setMobileFiltersOpen(false)} style={{ display: 'block', marginBottom: '16px', background: '#f9372c', border: 'none', borderRadius: '8px', padding: '10px', color: '#fff', cursor: 'pointer', width: '100%', fontSize: '14px', fontWeight: 600 }}>
              Zatvori filtere
            </button>
          )}
          {filterSidebar}
        </div>

        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ color: '#aaa', fontSize: '14px' }}>
              {loading ? 'Učitavanje...' : searchQuery ? `${total} rezultata za "${searchQuery}"` : `${total} delova`}
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <label htmlFor="sort-select" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>Sortiraj</label>
              <select id="sort-select" style={{ ...S.select, width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="price_asc">Cena: niža → viša</option>
                <option value="price_desc">Cena: viša → niža</option>
                <option value="newest">Najnovije</option>
              </select>
              {compareList.length > 0 && (
                <button onClick={() => router.push('/comparison?ids=' + compareList.join(','))} style={{ padding: '8px 16px', background: '#ff4d00', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>
                  Poredi ({compareList.length})
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div style={S.grid}>
              {Array.from({ length: PER_PAGE }).map((_, i) => (
                <div key={i} style={S.shimmer} />
              ))}
            </div>
          ) : (
            <div style={S.grid}>
              {displayParts.map((part, idx) => (
                <PartCard
                  key={part.id}
                  part={part}
                  priority={idx < 4}
                  compareSelected={compareList.includes(part.id)}
                  onCompareToggle={toggleCompare}
                  showCompare
                />
              ))}
            </div>
          )}

          {!loading && displayParts.length === 0 && (
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
            <nav aria-label="Paginacija" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '32px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="Prethodna stranica"
                style={{
                  padding: '8px 14px',
                  background: page <= 1 ? '#1a1b1f' : '#252629',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: page <= 1 ? '#555' : '#fff',
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                }}
              >
                ← Prethodna
              </button>
              {pageNumbers().map(n => (
                <button
                  key={n}
                  data-testid={`pagination-${n}`}
                  onClick={() => setPage(n)}
                  aria-label={`Stranica ${n}`}
                  aria-current={n === page ? 'page' : undefined}
                  style={{
                    padding: '8px 12px',
                    background: n === page ? '#ff4d00' : '#252629',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: n === page ? 700 : 400,
                    minWidth: '36px',
                  }}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                aria-label="Sledeća stranica"
                style={{
                  padding: '8px 14px',
                  background: page >= totalPages ? '#1a1b1f' : '#252629',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: page >= totalPages ? '#555' : '#fff',
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                }}
              >
                Sledeća →
              </button>
            </nav>
          )}
        </main>
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
