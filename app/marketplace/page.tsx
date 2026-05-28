'use client';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Part } from '@/lib/types';
import AddToCartButton from '@/app/components/AddToCartButton';
import InquiryButton from '@/app/components/InquiryButton';
import { bandEmoji, bandLabel, type Band } from '@/lib/confidence';

const STATIC_CATEGORIES = [
  { slug: 'motor', name: 'Motor', icon: '⚙️' },
  { slug: 'kocnice', name: 'Kocnice', icon: '🛑' },
  { slug: 'elektronika', name: 'Elektronika', icon: '⚡' },
  { slug: 'karoserija', name: 'Karoserija', icon: '🚗' },
  { slug: 'suspenzija', name: 'Suspenzija', icon: '🔧' },
  { slug: 'transmisija', name: 'Transmisija', icon: '⚙️' },
  { slug: 'ostalo', name: 'Ostalo', icon: '📦' },
];

const MAKES = ['Volkswagen','BMW','Mercedes','Audi','Opel','Renault','Peugeot','Fiat','Toyota','Ford','Skoda','Seat'];

const PER_PAGE = 24;

function bandForPart(part: Part): Band {
  if ((part.stock_quantity ?? 0) > 0) return 'verified';
  return 'inquiry';
}

function bandColor(band: Band): string {
  if (band === 'verified') return '#22c55e';
  if (band === 'likely') return '#eab308';
  return '#ef4444';
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function BandBadge({ band }: { band: Band }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        background: 'rgba(12,13,15,0.85)',
        color: bandColor(band),
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backdropFilter: 'blur(4px)',
        border: `1px solid ${bandColor(band)}`,
      }}
      title={bandLabel(band)}
    >
      <span aria-hidden="true">{bandEmoji(band)}</span>
      <span>{bandLabel(band)}</span>
    </div>
  );
}

function SmartImage({
  src,
  alt,
  priority,
}: {
  src: string | null | undefined;
  alt: string;
  priority?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  const effective = !src || errored ? '/images/part-placeholder.svg' : src;
  return (
    <Image
      src={effective}
      alt={alt}
      fill
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 220px"
      style={{ objectFit: 'cover' }}
      priority={!!priority}
      loading={priority ? undefined : 'lazy'}
      onError={() => setErrored(true)}
      unoptimized
    />
  );
}

function PriceRangeFilter({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
}: {
  minPrice: string;
  maxPrice: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
}) {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    background: '#0c0d0f',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Raspon cena (RSD)</label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="number"
          placeholder="Od"
          value={minPrice}
          onChange={e => onMinChange(e.target.value)}
          style={inputStyle}
          min={0}
        />
        <span style={{ color: '#555', flexShrink: 0 }}>–</span>
        <input
          type="number"
          placeholder="Do"
          value={maxPrice}
          onChange={e => onMaxChange(e.target.value)}
          style={inputStyle}
          min={0}
        />
      </div>
    </div>
  );
}

function ActiveFilterTags({
  filters,
  onRemove,
}: {
  filters: { key: string; label: string }[];
  onRemove: (key: string) => void;
}) {
  if (filters.length === 0) return null;
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
      {filters.map(f => (
        <button
          key={f.key}
          onClick={() => onRemove(f.key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'rgba(249,55,44,0.1)',
            border: '1px solid rgba(249,55,44,0.3)',
            borderRadius: '20px',
            color: '#f9372c',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          {f.label}
          <span style={{ fontSize: '14px', lineHeight: 1 }}>×</span>
        </button>
      ))}
    </div>
  );
}

function FilterSidebar({
  searchInput,
  setSearchInput,
  searchQuery,
  handleSearch,
  clearSearch,
  availOnly,
  setAvailOnly,
  filterMake,
  setFilterMake,
  filterCategory,
  setFilterCategory,
  filterInStock,
  setFilterInStock,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  resetAll,
}: {
  searchInput: string;
  setSearchInput: (v: string) => void;
  searchQuery: string;
  handleSearch: (e: React.FormEvent) => void;
  clearSearch: () => void;
  availOnly: boolean;
  setAvailOnly: (v: boolean) => void;
  filterMake: string;
  setFilterMake: (v: string) => void;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  filterInStock: boolean;
  setFilterInStock: (v: boolean) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  resetAll: () => void;
}) {
  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    background: '#0c0d0f',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
  };

  const labelStyle: React.CSSProperties = {
    color: '#aaa',
    fontSize: '13px',
    display: 'block',
    marginBottom: '4px',
  };

  return (
    <>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Pretraga</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Naziv, broj dela, brend..."
            style={{ ...selectStyle, flex: 1, padding: '8px 12px' }}
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
        <label style={labelStyle}>Dostupnost</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ddd', fontSize: '13px', cursor: 'pointer' }}>
            <input type="radio" name="avail" checked={!availOnly} onChange={() => setAvailOnly(false)} style={{ accentColor: '#ff4d00' }} />
            Sve ponude
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ddd', fontSize: '13px', cursor: 'pointer' }}>
            <input type="radio" name="avail" checked={availOnly} onChange={() => setAvailOnly(true)} style={{ accentColor: '#ff4d00' }} />
            Samo dostupno (🟢 + 🟡)
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Marka</label>
        <select style={selectStyle} value={filterMake} onChange={e => setFilterMake(e.target.value)}>
          <option value="">Sve marke</option>
          {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Kategorija</label>
        <select style={selectStyle} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">Sve kategorije</option>
          {STATIC_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      <PriceRangeFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinChange={setMinPrice}
        onMaxChange={setMaxPrice}
      />

      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" id="instock" checked={filterInStock} onChange={e => setFilterInStock(e.target.checked)} style={{ accentColor: '#ff4d00' }} />
        <label htmlFor="instock" style={{ color: '#aaa', fontSize: '13px', cursor: 'pointer' }}>Samo na stanju</label>
      </div>

      <button onClick={resetAll} style={{ width: '100%', padding: '8px', background: '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>
        Resetuj sve
      </button>
    </>
  );
}

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
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get('page') || '1');
    return Number.isFinite(p) && p > 0 ? p : 1;
  });

  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      setSearchInput(q);
    }
  }, [searchParams]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (searchQuery && searchQuery.length >= 2) {
          const params = new URLSearchParams();
          params.set('q', searchQuery);
          if (filterCategory) params.set('category', filterCategory);
          if (filterInStock) params.set('in_stock', 'true');
          if (debouncedMinPrice) params.set('min_price', debouncedMinPrice);
          if (debouncedMaxPrice) params.set('max_price', debouncedMaxPrice);
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
          if (debouncedMinPrice) params.set('min_price', debouncedMinPrice);
          if (debouncedMaxPrice) params.set('max_price', debouncedMaxPrice);
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
  }, [filterMake, filterCategory, filterInStock, sortBy, searchQuery, page, debouncedMinPrice, debouncedMaxPrice]);

  useEffect(() => {
    setPage(1);
  }, [filterMake, filterCategory, filterInStock, sortBy, searchQuery, debouncedMinPrice, debouncedMaxPrice]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (availOnly) params.set('avail', '1');
    else params.delete('avail');
    const qs = params.toString();
    router.replace(qs ? `/marketplace?${qs}` : '/marketplace', { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availOnly]);

  const toggleCompare = (id: string) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setMobileFiltersOpen(false);
  }

  function clearSearch() {
    setSearchQuery('');
    setSearchInput('');
  }

  function resetAll() {
    setFilterMake('');
    setFilterCategory('');
    setFilterInStock(false);
    setAvailOnly(false);
    setMinPrice('');
    setMaxPrice('');
    clearSearch();
    setMobileFiltersOpen(false);
  }

  const activeFilters: { key: string; label: string }[] = [];
  if (searchQuery) activeFilters.push({ key: 'search', label: `"${searchQuery}"` });
  if (filterMake) activeFilters.push({ key: 'make', label: filterMake });
  if (filterCategory) {
    const cat = STATIC_CATEGORIES.find(c => c.slug === filterCategory);
    activeFilters.push({ key: 'category', label: cat?.name || filterCategory });
  }
  if (filterInStock) activeFilters.push({ key: 'instock', label: 'Na stanju' });
  if (availOnly) activeFilters.push({ key: 'avail', label: 'Samo dostupno' });
  if (debouncedMinPrice) activeFilters.push({ key: 'minprice', label: `Od ${parseInt(debouncedMinPrice).toLocaleString('sr-RS')} RSD` });
  if (debouncedMaxPrice) activeFilters.push({ key: 'maxprice', label: `Do ${parseInt(debouncedMaxPrice).toLocaleString('sr-RS')} RSD` });

  function removeFilter(key: string) {
    switch (key) {
      case 'search': clearSearch(); break;
      case 'make': setFilterMake(''); break;
      case 'category': setFilterCategory(''); break;
      case 'instock': setFilterInStock(false); break;
      case 'avail': setAvailOnly(false); break;
      case 'minprice': setMinPrice(''); break;
      case 'maxprice': setMaxPrice(''); break;
    }
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

  const sidebarContent = (
    <FilterSidebar
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      searchQuery={searchQuery}
      handleSearch={handleSearch}
      clearSearch={clearSearch}
      availOnly={availOnly}
      setAvailOnly={setAvailOnly}
      filterMake={filterMake}
      setFilterMake={setFilterMake}
      filterCategory={filterCategory}
      setFilterCategory={setFilterCategory}
      filterInStock={filterInStock}
      setFilterInStock={setFilterInStock}
      minPrice={minPrice}
      setMinPrice={setMinPrice}
      maxPrice={maxPrice}
      setMaxPrice={setMaxPrice}
      resetAll={resetAll}
    />
  );

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <style>{`
        @media (max-width: 900px) {
          .mp-grid { grid-template-columns: 1fr !important; }
          .mp-sidebar-desktop { display: none !important; }
          .mp-mobile-filter-btn { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mp-mobile-filter-btn { display: none !important; }
          .mp-mobile-drawer { display: none !important; }
        }
      `}</style>

      <div className="mp-grid" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        {/* Desktop sidebar */}
        <div className="mp-sidebar-desktop" style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', height: 'fit-content', position: 'sticky', top: '80px' }}>
          {sidebarContent}
        </div>

        {/* Main content */}
        <div>
          {/* Mobile filter button */}
          <button
            className="mp-mobile-filter-btn"
            onClick={() => setMobileFiltersOpen(true)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '12px',
              background: '#1a1b1f',
              border: '1px solid #333',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            <span>⚙️</span> Filteri i pretraga
            {activeFilters.length > 0 && (
              <span style={{ background: '#f9372c', color: '#fff', fontSize: '11px', fontWeight: 700, borderRadius: '10px', padding: '2px 8px', marginLeft: '4px' }}>
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Active filter tags */}
          <ActiveFilterTags filters={activeFilters} onRemove={removeFilter} />

          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ color: '#aaa', fontSize: '14px' }}>
              {loading ? 'Učitavanje...' : searchQuery ? `${total} rezultata za "${searchQuery}"` : `${total} delova`}
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select
                style={{ padding: '8px 12px', background: '#0c0d0f', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="price_asc">Cena: niža → viša</option>
                <option value="price_desc">Cena: viša → niža</option>
                <option value="newest">Najnovije</option>
              </select>
              {compareList.length > 0 && (
                <button onClick={() => router.push('/comparison?ids=' + compareList.join(','))} style={{ padding: '8px 16px', background: '#ff4d00', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  Poredi ({compareList.length})
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {Array.from({ length: PER_PAGE }).map((_, i) => (
                <div key={i} style={{ background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '12px', height: '280px' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {displayParts.map((part, idx) => {
                const vehicle = part.compatible_vehicles?.[0];
                const inStock = (part.stock_quantity ?? 0) > 0;
                const partUrl = `/parts/${part.slug || part.id}`;
                const band = bandForPart(part);
                const priority = idx < 4;
                return (
                  <div
                    key={part.id}
                    style={{
                      background: '#1a1b1f',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: compareList.includes(part.id) ? '2px solid #ff4d00' : '2px solid transparent',
                      animation: 'fadeIn 0.3s ease',
                      animationFillMode: 'both',
                      animationDelay: `${Math.min(idx * 30, 300)}ms`,
                    }}
                  >
                    <Link href={partUrl} style={{ textDecoration: 'none' }}>
                      <div style={{ position: 'relative', background: '#252629', height: '140px', overflow: 'hidden' }}>
                        <SmartImage src={part.images?.[0]} alt={part.name} priority={priority} />
                        <BandBadge band={band} />
                      </div>
                    </Link>
                    <div style={{ padding: '12px' }}>
                      {vehicle && <p style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px' }}>{vehicle.make} {vehicle.model}</p>}
                      <Link href={partUrl} style={{ textDecoration: 'none' }}>
                        <h3 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', lineHeight: '1.3' }}>{part.name_sr || part.name}</h3>
                      </Link>
                      <p style={{ color: '#ff4d00', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{part.price?.toLocaleString('sr-RS')} RSD</p>
                      {part.price_eur && (
                        <p style={{ color: '#666', fontSize: '11px', marginBottom: '6px' }}>≈ €{part.price_eur.toFixed(2)}</p>
                      )}
                      <p style={{ color: inStock ? '#22c55e' : '#ef4444', fontSize: '12px', marginBottom: '10px' }}>{inStock ? '✓ Na stanju' : '✗ Nema na stanju'}</p>

                      <div style={{ marginBottom: '6px' }}>
                        {band === 'inquiry' ? (
                          <>
                            <InquiryButton part={part} />
                            <p style={{ color: '#aaa', fontSize: '11px', fontStyle: 'italic', margin: '6px 0 0' }}>
                              Proveri sa prodavcem
                            </p>
                          </>
                        ) : (
                          <>
                            <AddToCartButton part={part} full inStock={inStock} />
                            {band === 'likely' && (
                              <p style={{ color: '#888', fontSize: '11px', margin: '6px 0 0' }}>
                                Dostupnost proverena skoro; potvrda pri obradi.
                              </p>
                            )}
                          </>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                        <Link href={partUrl} style={{ flex: 1, padding: '8px', background: '#333', borderRadius: '8px', color: '#fff', textDecoration: 'none', textAlign: 'center', fontSize: '13px' }}>Detalji</Link>
                        <button onClick={() => toggleCompare(part.id)} style={{ padding: '8px', background: compareList.includes(part.id) ? '#ff4d00' : '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }} title="Uporedi">≈</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && displayParts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '48px' }}>🔍</p>
              <p style={{ fontSize: '18px', color: '#aaa', marginBottom: '8px' }}>
                {searchQuery ? `Nema rezultata za "${searchQuery}"` : 'Nema rezultata za date filtere'}
              </p>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                Pokušajte sa širim filterima ili drugačijim pojmom za pretragu
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {searchQuery && (
                  <button onClick={clearSearch} style={{ padding: '10px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                    Obriši pretragu
                  </button>
                )}
                <button onClick={resetAll} style={{ padding: '10px 24px', background: '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>
                  Resetuj sve filtere
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '32px', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page <= 1}
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
                  onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page >= totalPages}
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
            </div>
          )}

          {/* Results count footer */}
          {!loading && total > 0 && (
            <p style={{ textAlign: 'center', color: '#555', fontSize: '12px', marginTop: '16px' }}>
              Prikazano {Math.min(displayParts.length, PER_PAGE)} od {total} rezultata · Strana {page} od {totalPages}
            </p>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div
          className="mp-mobile-drawer"
          onClick={e => { if (e.target === e.currentTarget) setMobileFiltersOpen(false); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <div style={{
            width: '100%',
            maxHeight: '85vh',
            background: '#1a1b1f',
            borderRadius: '16px 16px 0 0',
            padding: '20px',
            overflowY: 'auto',
            animation: 'slideUp 0.25s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>Filteri</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '24px', cursor: 'pointer', padding: '4px 8px' }}
              >
                ×
              </button>
            </div>
            {sidebarContent}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              style={{ width: '100%', padding: '14px', background: '#f9372c', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '16px' }}
            >
              Prikaži rezultate ({total})
            </button>
          </div>
        </div>
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#f9372c',
            border: 'none',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 50,
            boxShadow: '0 4px 12px rgba(249,55,44,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease',
          }}
          title="Nazad na vrh"
        >
          ↑
        </button>
      )}
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
