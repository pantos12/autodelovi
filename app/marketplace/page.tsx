'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
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

function BandBadge({ band }: { band: Band }) {
  return (
    <div
      style={{
        position: 'absolute', top: 8, right: 8,
        background: 'rgba(12,13,15,0.85)', color: bandColor(band),
        padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
        display: 'flex', alignItems: 'center', gap: '4px',
        backdropFilter: 'blur(4px)', border: `1px solid ${bandColor(band)}`,
      }}
      title={bandLabel(band)}
    >
      <span aria-hidden="true">{bandEmoji(band)}</span>
      <span>{bandLabel(band)}</span>
    </div>
  );
}

function SmartImage({ src, alt, priority }: { src: string | null | undefined; alt: string; priority?: boolean }) {
  const [errored, setErrored] = useState(false);
  const effective = !src || errored ? '/images/part-placeholder.svg' : src;
  return (
    <Image
      src={effective} alt={alt} fill
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 220px"
      style={{ objectFit: 'cover' }}
      priority={!!priority}
      loading={priority ? undefined : 'lazy'}
      onError={() => setErrored(true)}
    />
  );
}

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filterMake, setFilterMake] = useState(searchParams.get('make') || '');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || '');
  const [filterInStock, setFilterInStock] = useState(searchParams.get('in_stock') === '1');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'price_asc');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [availOnly, setAvailOnly] = useState(searchParams.get('avail') === '1');
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get('page') || '1');
    return Number.isFinite(p) && p > 0 ? p : 1;
  });

  // Sync all filter state to URL so refreshing preserves filters
  const syncUrl = useCallback((overrides: Record<string, string | undefined> = {}) => {
    const state: Record<string, string | undefined> = {
      q: searchQuery || undefined,
      make: filterMake || undefined,
      category: filterCategory || undefined,
      in_stock: filterInStock ? '1' : undefined,
      sort: sortBy !== 'price_asc' ? sortBy : undefined,
      avail: availOnly ? '1' : undefined,
      page: page > 1 ? String(page) : undefined,
      ...overrides,
    };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(state)) {
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    router.replace(qs ? `/marketplace?${qs}` : '/marketplace', { scroll: false });
  }, [searchQuery, filterMake, filterCategory, filterInStock, sortBy, availOnly, page, router]);

  useEffect(() => {
    syncUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMake, filterCategory, filterInStock, sortBy, availOnly, searchQuery, page]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q !== searchQuery) {
      setSearchQuery(q);
      setSearchInput(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery && searchQuery.length >= 2) {
          params.set('q', searchQuery);
        }
        if (filterMake) params.set('make', filterMake);
        if (filterCategory) params.set('category', filterCategory);
        if (filterInStock) params.set('in_stock', 'true');
        params.set('sort', sortBy);
        params.set('per_page', String(PER_PAGE));
        params.set('page', String(page));

        const endpoint = searchQuery && searchQuery.length >= 2 ? '/api/search' : '/api/parts';
        const res = await fetch(`${endpoint}?${params}`, { signal: controller.signal });
        const json = await res.json();
        setParts(json.data || []);
        setTotal(json.meta?.total || json.data?.length || 0);
      } catch (err: any) {
        if (err?.name !== 'AbortError') setParts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [filterMake, filterCategory, filterInStock, sortBy, searchQuery, page]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filterMake, filterCategory, filterInStock, sortBy, searchQuery]);

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

  function resetAll() {
    setFilterMake('');
    setFilterCategory('');
    setFilterInStock(false);
    setAvailOnly(false);
    setSortBy('price_asc');
    clearSearch();
    setFiltersOpen(false);
  }

  const activeFilterCount = [filterMake, filterCategory, filterInStock, availOnly, searchQuery].filter(Boolean).length;

  const s = {
    page: { background: '#0c0d0f', minHeight: '100vh' } as React.CSSProperties,
    label: { color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '4px' } as React.CSSProperties,
    select: { width: '100%', padding: '8px 12px', background: '#0c0d0f', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px' } as React.CSSProperties,
    card: { background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden' } as React.CSSProperties,
  };

  const displayParts = availOnly
    ? parts.filter(p => { const b = bandForPart(p); return b === 'verified' || b === 'likely'; })
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
    <>
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
        <label style={s.label}>Dostupnost</label>
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
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" id="instock" checked={filterInStock} onChange={e => setFilterInStock(e.target.checked)} style={{ accentColor: '#ff4d00' }} />
        <label htmlFor="instock" style={{ color: '#aaa', fontSize: '13px', cursor: 'pointer' }}>Samo na stanju</label>
      </div>
      <button onClick={resetAll} style={{ width: '100%', padding: '8px', background: '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>
        Resetuj sve
      </button>
    </>
  );

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 768px) {
          .mp-layout { grid-template-columns: 1fr !important; }
          .mp-sidebar-desktop { display: none !important; }
          .mp-filter-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mp-filter-toggle { display: none !important; }
          .mp-sidebar-mobile { display: none !important; }
        }
      `}</style>

      {/* Mobile filter toggle */}
      <div className="mp-filter-toggle" style={{ display: 'none', padding: '12px 16px', gap: '8px', alignItems: 'center', background: '#0c0d0f', position: 'sticky', top: '64px', zIndex: 20, borderBottom: '1px solid #1a1b1f' }}>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}
        >
          <span>⚙ Filteri</span>
          {activeFilterCount > 0 && (
            <span style={{ background: '#f9372c', color: '#fff', fontSize: '10px', fontWeight: 700, borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {activeFilterCount}
            </span>
          )}
        </button>
        <select style={{ ...s.select, width: 'auto', flex: 1 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="price_asc">Cena ↑</option>
          <option value="price_desc">Cena ↓</option>
          <option value="newest">Najnovije</option>
        </select>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="mp-sidebar-mobile" style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.6)' }} onClick={e => { if (e.target === e.currentTarget) setFiltersOpen(false); }}>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '300px', maxWidth: '85vw', background: '#1a1b1f', padding: '20px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>Filteri</h3>
              <button onClick={() => setFiltersOpen(false)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '24px', cursor: 'pointer', padding: '4px' }}>×</button>
            </div>
            {sidebarContent}
            <button
              onClick={() => setFiltersOpen(false)}
              style={{ width: '100%', padding: '12px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600, marginTop: '16px' }}
            >
              Prikaži rezultate ({total})
            </button>
          </div>
        </div>
      )}

      <div className="mp-layout" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        {/* Desktop sidebar */}
        <div className="mp-sidebar-desktop" style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', height: 'fit-content', position: 'sticky', top: '80px' }}>
          {sidebarContent}
        </div>

        {/* Main content */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ color: '#aaa', fontSize: '14px' }}>
              {loading ? 'Učitavanje...' : searchQuery ? `${total} rezultata za "${searchQuery}"` : `${total} delova`}
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select className="mp-sidebar-desktop" style={{ ...s.select, width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ ...s.card, height: '280px', background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
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
                  <div key={part.id} style={{ ...s.card, border: compareList.includes(part.id) ? '2px solid #ff4d00' : '2px solid transparent', transition: 'border-color 0.15s' }}>
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
                      <p style={{ color: '#ff4d00', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{part.price?.toLocaleString('sr-RS')} RSD</p>
                      <p style={{ color: inStock ? '#22c55e' : '#ef4444', fontSize: '12px', marginBottom: '10px' }}>{inStock ? 'Na stanju' : 'Nema na stanju'}</p>

                      <div style={{ marginBottom: '6px' }}>
                        {band === 'inquiry' ? (
                          <>
                            <InquiryButton part={part} />
                            <p style={{ color: '#aaa', fontSize: '11px', fontStyle: 'italic', margin: '6px 0 0' }}>
                              Proveri sa prodavcem
                            </p>
                          </>
                        ) : (
                          <AddToCartButton part={part} full inStock={inStock} />
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

          {!loading && displayParts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '48px' }}>🔍</p>
              <p style={{ fontSize: '18px', color: '#aaa' }}>
                {searchQuery ? `Nema rezultata za "${searchQuery}"` : 'Nema rezultata za date filtere'}
              </p>
              {searchQuery ? (
                <button onClick={clearSearch} style={{ marginTop: '16px', padding: '10px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>
                  Obriši pretragu
                </button>
              ) : (
                <button onClick={resetAll} style={{ marginTop: '16px', padding: '10px 24px', background: '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>
                  Resetuj filtere
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '32px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{
                  padding: '8px 14px',
                  background: page <= 1 ? '#1a1b1f' : '#252629',
                  border: '1px solid #333', borderRadius: '8px',
                  color: page <= 1 ? '#555' : '#fff',
                  cursor: page <= 1 ? 'not-allowed' : 'pointer', fontSize: '13px',
                }}
              >
                ← Prethodna
              </button>
              {pageNumbers().map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  style={{
                    padding: '8px 12px',
                    background: n === page ? '#ff4d00' : '#252629',
                    border: '1px solid #333', borderRadius: '8px',
                    color: '#fff', cursor: 'pointer', fontSize: '13px',
                    fontWeight: n === page ? 700 : 400, minWidth: '36px',
                  }}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                style={{
                  padding: '8px 14px',
                  background: page >= totalPages ? '#1a1b1f' : '#252629',
                  border: '1px solid #333', borderRadius: '8px',
                  color: page >= totalPages ? '#555' : '#fff',
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer', fontSize: '13px',
                }}
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
