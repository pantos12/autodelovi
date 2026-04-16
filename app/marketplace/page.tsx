'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
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

const PER_PAGE = 24;

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [filterMake, setFilterMake] = useState(searchParams.get('make') || '');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || '');
  const [filterInStock, setFilterInStock] = useState(false);
  const [sortBy, setSortBy] = useState('price_asc');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      setSearchInput(q);
    }
  }, [searchParams]);

  const loadParts = useCallback(async (page: number) => {
    setLoading(true);
    try {
      if (searchQuery && searchQuery.length >= 2) {
        const params = new URLSearchParams();
        params.set('q', searchQuery);
        if (filterCategory) params.set('category', filterCategory);
        if (filterInStock) params.set('in_stock', 'true');
        if (minPrice) params.set('min_price', minPrice);
        if (maxPrice) params.set('max_price', maxPrice);
        params.set('per_page', String(PER_PAGE));
        params.set('page', String(page));
        const res = await fetch(`/api/search?${params}`);
        const json = await res.json();
        setParts(json.data || []);
        setTotal(json.meta?.total || json.data?.length || 0);
        setTotalPages(json.meta?.total_pages || Math.ceil((json.meta?.total || 0) / PER_PAGE));
      } else {
        const params = new URLSearchParams();
        if (filterMake) params.set('make', filterMake);
        if (filterCategory) params.set('category', filterCategory);
        if (filterInStock) params.set('in_stock', 'true');
        if (minPrice) params.set('min_price', minPrice);
        if (maxPrice) params.set('max_price', maxPrice);
        params.set('sort', sortBy);
        params.set('per_page', String(PER_PAGE));
        params.set('page', String(page));
        const res = await fetch(`/api/parts?${params}`);
        const json = await res.json();
        setParts(json.data || []);
        setTotal(json.meta?.total || json.data?.length || 0);
        setTotalPages(json.meta?.total_pages || Math.ceil((json.meta?.total || 0) / PER_PAGE));
      }
    } catch {
      setParts([]);
    } finally {
      setLoading(false);
    }
  }, [filterMake, filterCategory, filterInStock, sortBy, searchQuery, minPrice, maxPrice]);

  useEffect(() => {
    setCurrentPage(1);
    loadParts(1);
  }, [loadParts]);

  function goToPage(page: number) {
    setCurrentPage(page);
    loadParts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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

  function clearAllFilters() {
    setFilterMake('');
    setFilterCategory('');
    setFilterInStock(false);
    setMinPrice('');
    setMaxPrice('');
    clearSearch();
  }

  const activeFilterCount = [filterMake, filterCategory, filterInStock, minPrice, maxPrice, searchQuery].filter(Boolean).length;

  const s = {
    page: { background: '#0c0d0f', minHeight: '100vh' } as React.CSSProperties,
    label: { color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '4px' } as React.CSSProperties,
    select: { width: '100%', padding: '8px 12px', background: '#0c0d0f', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px' } as React.CSSProperties,
    card: { background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden' } as React.CSSProperties,
  };

  function renderPagination() {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    const btnBase: React.CSSProperties = {
      padding: '8px 14px', border: 'none', borderRadius: '8px',
      color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
    };

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '32px', flexWrap: 'wrap' }}>
        <button
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
          style={{ ...btnBase, background: currentPage === 1 ? '#1a1b1f' : '#333', opacity: currentPage === 1 ? 0.4 : 1 }}
        >
          ← Preth.
        </button>
        {pages.map((p, i) =>
          typeof p === 'string' ? (
            <span key={`e${i}`} style={{ padding: '8px 4px', color: '#555' }}>...</span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p)}
              style={{ ...btnBase, background: p === currentPage ? '#f9372c' : '#1a1b1f', fontWeight: p === currentPage ? 700 : 500 }}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
          style={{ ...btnBase, background: currentPage === totalPages ? '#1a1b1f' : '#333', opacity: currentPage === totalPages ? 0.4 : 1 }}
        >
          Sled. →
        </button>
      </div>
    );
  }

  const sidebar = (
    <>
      {/* Search input in sidebar */}
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

      <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '16px' }}>
        Filteri
        {activeFilterCount > 0 && (
          <span style={{ marginLeft: '8px', background: '#f9372c', color: '#fff', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>
            {activeFilterCount}
          </span>
        )}
      </h3>
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
          {STATIC_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {/* Price range filter */}
      <div style={{ marginBottom: '16px' }}>
        <label style={s.label}>Cena (RSD)</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Od"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            style={{ ...s.select, width: '50%', padding: '8px', fontSize: '13px' }}
            min="0"
          />
          <span style={{ color: '#555' }}>–</span>
          <input
            type="number"
            placeholder="Do"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            style={{ ...s.select, width: '50%', padding: '8px', fontSize: '13px' }}
            min="0"
          />
        </div>
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" id="instock" checked={filterInStock} onChange={e => setFilterInStock(e.target.checked)} style={{ accentColor: '#ff4d00' }} />
        <label htmlFor="instock" style={{ color: '#aaa', fontSize: '13px', cursor: 'pointer' }}>Samo na stanju</label>
      </div>
      <button onClick={clearAllFilters} style={{ width: '100%', padding: '8px', background: '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>
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
          .marketplace-sidebar.open { display: block; position: fixed; top: 64px; left: 0; right: 0; bottom: 0; z-index: 50; background: #0c0d0f; padding: 20px; overflow-y: auto; }
          .mobile-filter-btn { display: flex !important; }
          .parts-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important; }
        }
      `}</style>

      <div className="marketplace-grid" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        {/* Mobile filter button */}
        <button
          className="mobile-filter-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ display: 'none', alignItems: 'center', gap: '8px', gridColumn: '1 / -1', padding: '10px 16px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}
        >
          ☰ Filteri {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>

        <div className={`marketplace-sidebar${sidebarOpen ? ' open' : ''}`} style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', height: 'fit-content', position: 'sticky' as const, top: '80px' }}>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} style={{ display: 'block', marginBottom: '16px', padding: '8px 16px', background: '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', width: '100%' }}>
              ✕ Zatvori filtere
            </button>
          )}
          {sidebar}
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ color: '#aaa', fontSize: '14px' }}>
              {loading ? 'Učitavanje...' : searchQuery ? `${total} rezultata za "${searchQuery}"` : `${total} delova`}
              {!loading && totalPages > 1 && ` · Strana ${currentPage} od ${totalPages}`}
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select style={{ ...s.select, width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="price_asc">Cena: niža → viša</option>
                <option value="price_desc">Cena: viša → niža</option>
                <option value="newest">Najnovije</option>
              </select>
              {compareList.length > 0 && (
                <button onClick={() => router.push('/comparison?ids=' + compareList.join(','))} style={{ padding: '8px 16px', background: '#ff4d00', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>
                  Poredi ({compareList.length})
                </button>
              )}
            </div>
          </div>
          {loading ? (
            <div className="parts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ ...s.card, height: '280px', background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite linear' }} />
              ))}
            </div>
          ) : (
            <>
              <div className="parts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {parts.map(part => {
                  const vehicle = part.compatible_vehicles?.[0];
                  const inStock = (part.stock_quantity ?? 0) > 0;
                  const partUrl = `/parts/${part.slug || part.id}`;
                  return (
                    <div key={part.id} className="animate-fadeIn" style={{ ...s.card, border: compareList.includes(part.id) ? '2px solid #ff4d00' : '2px solid transparent', transition: 'border-color 0.2s, transform 0.2s', cursor: 'default' }}>
                      <div style={{ background: '#252629', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', overflow: 'hidden' }}>
                        {part.images?.[0] ? <img src={part.images[0]} alt={part.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" /> : '🔧'}
                      </div>
                      <div style={{ padding: '12px' }}>
                        {vehicle && <p style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px' }}>{vehicle.make} {vehicle.model}</p>}
                        <h3 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{part.name_sr || part.name}</h3>
                        <p style={{ color: '#ff4d00', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{part.price?.toLocaleString('sr-RS')} RSD</p>
                        {part.price_eur && <p style={{ color: '#777', fontSize: '12px', marginBottom: '4px' }}>≈ €{part.price_eur.toFixed(0)}</p>}
                        <p style={{ color: inStock ? '#22c55e' : '#ef4444', fontSize: '12px', marginBottom: '10px' }}>{inStock ? '✓ Na stanju' : '✗ Nema na stanju'}</p>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <Link href={partUrl} style={{ flex: 1, padding: '8px', background: '#ff4d00', borderRadius: '8px', color: '#fff', textDecoration: 'none', textAlign: 'center', fontSize: '13px' }}>Detalji</Link>
                          <button onClick={() => toggleCompare(part.id)} title="Dodaj u poređenje" style={{ padding: '8px 10px', background: compareList.includes(part.id) ? '#ff4d00' : '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>⚖️</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {renderPagination()}
            </>
          )}
          {!loading && parts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '48px' }}>🔍</p>
              <p style={{ fontSize: '18px', color: '#aaa', marginBottom: '8px' }}>
                {searchQuery ? `Nema rezultata za "${searchQuery}"` : 'Nema rezultata za date filtere'}
              </p>
              <p style={{ color: '#555', fontSize: '14px', marginBottom: '20px' }}>Pokušajte da promenite filtere ili pretražite nešto drugo</p>
              <button onClick={clearAllFilters} style={{ padding: '10px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>
                Resetuj filtere
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
