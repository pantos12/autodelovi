'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Part } from '@/lib/types';

const ATTRS: { key: keyof Part | string; label: string }[] = [
  { key: 'price', label: 'Cena (RSD)' },
  { key: 'category_id', label: 'Kategorija' },
  { key: 'brand', label: 'Marka' },
  { key: 'part_number', label: 'Broj dela' },
  { key: 'oem_number', label: 'OEM broj' },
  { key: 'condition', label: 'Stanje' },
  { key: 'stock_quantity', label: 'Na stanju' },
];

function getCellStyle(key: string, value: any, allValues: any[]): React.CSSProperties {
  if (key !== 'price') return { color: '#fff' };
  const nums = allValues.filter(v => typeof v === 'number') as number[];
  if (nums.length < 2) return { color: '#fff' };
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (value === min) return { color: '#22c55e', fontWeight: 700 };
  if (value === max) return { color: '#ef4444', fontWeight: 700 };
  return { color: '#fff' };
}

function formatValue(key: string, value: any): string {
  if (key === 'price') return typeof value === 'number' ? value.toLocaleString('sr-RS') + ' RSD' : '-';
  if (key === 'stock_quantity') return (value ?? 0) > 0 ? `✓ ${value} kom` : '✗ Nema';
  if (key === 'condition') {
    if (value === 'new') return 'Novo';
    if (value === 'used') return 'Polovno';
    if (value === 'refurbished') return 'Obnovljeno';
  }
  if (value === null || value === undefined) return '-';
  return String(value);
}

function ComparisonContent() {
  const searchParams = useSearchParams();
  const initialIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds.slice(0, 3));
  const [parts, setParts] = useState<Part[]>([]);
  const [searchResults, setSearchResults] = useState<Part[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Search parts on demand with debounce instead of loading all eagerly
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!search || search.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(search)}&per_page=10`);
        const json = await res.json();
        setSearchResults((json.data || []).filter((p: Part) => !selectedIds.includes(p.id)));
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, selectedIds]);

  useEffect(() => {
    if (selectedIds.length === 0) { setParts([]); return; }
    setLoading(true);
    Promise.all(selectedIds.map(id => fetch(`/api/parts/${id}`).then(r => r.json()).then(d => d.data || d)))
      .then(results => setParts(results.filter(Boolean)))
      .catch(() => setParts([]))
      .finally(() => setLoading(false));
  }, [selectedIds]);

  const addPart = (id: string) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
      setSearch('');
      setSearchResults([]);
    }
  };
  const removePart = (id: string) => setSelectedIds(selectedIds.filter(x => x !== id));

  const s = {
    page: { background: '#0c0d0f', minHeight: '100vh' } as React.CSSProperties,
    container: { maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' } as React.CSSProperties,
    input: { width: '100%', padding: '10px 14px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' },
    th: { padding: '12px 16px', background: '#1a1b1f', color: '#aaa', fontSize: '13px', fontWeight: 600, textAlign: 'left' as const, borderBottom: '1px solid #252629' },
    td: { padding: '12px 16px', borderBottom: '1px solid #1a1b1f', fontSize: '14px' },
  };

  if (parts.length === 0 && selectedIds.length === 0) {
    return (
      <div style={s.page}>
        <div style={{ ...s.container, textAlign: 'center', paddingTop: '80px' }}>
          <p style={{ fontSize: '64px', marginBottom: '16px' }}>⚖️</p>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Poređenje delova</h1>
          <p style={{ color: '#aaa', marginBottom: '32px' }}>Izaberite do 3 dela za poređenje</p>
          <div style={{ maxWidth: '400px', margin: '0 auto', position: 'relative' }}>
            <input
              style={s.input}
              placeholder="Pretraži delove (min 2 karaktera)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {searching && <p style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>Pretraga...</p>}
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '8px' }}>
              {searchResults.map(p => (
                <div key={p.id} onClick={() => addPart(p.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#1a1b1f', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', border: '1px solid transparent', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#ff4d00')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                >
                  <div>
                    <span style={{ color: '#fff', fontSize: '14px' }}>{p.name_sr || p.name}</span>
                    <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>{p.brand}</span>
                  </div>
                  <span style={{ color: '#ff4d00', fontSize: '14px', fontWeight: 600, flexShrink: 0 }}>{p.price?.toLocaleString('sr-RS')} RSD</span>
                </div>
              ))}
              {search.length >= 2 && !searching && searchResults.length === 0 && (
                <p style={{ color: '#555', fontSize: '13px', textAlign: 'center', padding: '12px' }}>Nema rezultata</p>
              )}
            </div>
          </div>
          <Link href="/marketplace" style={{ color: '#ff4d00', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginTop: '24px' }}>← Nazad na marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 768px) {
          .compare-slots { grid-template-columns: 1fr !important; }
          .compare-table { overflow-x: auto; }
        }
      `}</style>
      <div style={s.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800 }}>Poređenje delova</h1>
          <Link href="/marketplace" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>← Nazad</Link>
        </div>

        {/* Part selector */}
        <div className="compare-slots" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {Array.from({ length: 3 }).map((_, i) => {
            const part = parts[i];
            return (
              <div key={i} style={{ background: '#1a1b1f', borderRadius: '12px', padding: '16px', border: '1px solid #252629', textAlign: 'center', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {part ? (
                  <>
                    <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{part.name_sr || part.name}</p>
                    <p style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>{part.brand}</p>
                    <p style={{ color: '#ff4d00', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>{part.price?.toLocaleString('sr-RS')} RSD</p>
                    <button onClick={() => removePart(part.id)} style={{ padding: '6px 12px', background: '#333', border: 'none', borderRadius: '6px', color: '#aaa', cursor: 'pointer', fontSize: '12px' }}>Ukloni</button>
                  </>
                ) : selectedIds.length < 3 ? (
                  <div style={{ width: '100%' }}>
                    <p style={{ color: '#555', fontSize: '14px', marginBottom: '8px' }}>+ Dodaj deo</p>
                    <input style={{ ...s.input, fontSize: '12px', padding: '6px 10px' }} placeholder="Pretraži..." value={search} onChange={e => setSearch(e.target.value)} />
                    {search.length >= 2 && searchResults.slice(0, 5).map(p => (
                      <div key={p.id} onClick={() => addPart(p.id)} style={{ padding: '6px 10px', background: '#252629', borderRadius: '6px', marginTop: '4px', cursor: 'pointer', textAlign: 'left' }}>
                        <span style={{ color: '#fff', fontSize: '12px' }}>{(p.name_sr || p.name).slice(0, 35)}</span>
                        <span style={{ color: '#888', fontSize: '11px', marginLeft: '6px' }}>{p.brand}</span>
                      </div>
                    ))}
                    {search.length >= 2 && searching && <p style={{ color: '#555', fontSize: '11px', marginTop: '4px' }}>Pretraga...</p>}
                  </div>
                ) : (
                  <p style={{ color: '#555', fontSize: '13px' }}>Maks. 3 dela</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        {parts.length > 0 && (
          <div className="compare-table" style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid #252629' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
              <thead>
                <tr>
                  <th style={s.th}>Karakteristika</th>
                  {parts.map(p => <th key={p.id} style={s.th}>{p.name_sr || p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {ATTRS.map(attr => {
                  const vals = parts.map(p => (p as any)[attr.key]);
                  return (
                    <tr key={attr.key}>
                      <td style={{ ...s.td, color: '#aaa', fontWeight: 500 }}>{attr.label}</td>
                      {vals.map((val, i) => (
                        <td key={i} style={{ ...s.td, ...getCellStyle(attr.key, val, vals) }}>
                          {formatValue(attr.key, val)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>Učitavanje...</div>
        )}
      </div>
    </div>
  );
}

export default function ComparisonPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#aaa' }}>Učitavanje...</div>}>
      <ComparisonContent />
    </Suspense>
  );
}
