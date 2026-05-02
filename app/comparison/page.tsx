'use client';
import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
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

function getCellStyle(key: string, value: unknown, allValues: unknown[]): React.CSSProperties {
  if (key !== 'price') return { color: '#fff' };
  const nums = allValues.filter(v => typeof v === 'number') as number[];
  if (nums.length < 2) return { color: '#fff' };
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (value === min) return { color: '#22c55e', fontWeight: 700 };
  if (value === max) return { color: '#ef4444', fontWeight: 700 };
  return { color: '#fff' };
}

function formatValue(key: string, value: unknown): string {
  if (key === 'price') return typeof value === 'number' ? value.toLocaleString('sr-RS') + ' RSD' : '-';
  if (key === 'stock_quantity') return ((value as number) ?? 0) > 0 ? `✓ ${value} kom` : '✗ Nema';
  if (value === null || value === undefined) return '-';
  return String(value);
}

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function PartSearchDropdown({ onSelect, excludeIds }: { onSelect: (p: Part) => void; excludeIds: string[] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Part[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) { setResults([]); return; }
    setSearching(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&per_page=10`)
      .then(r => r.json())
      .then(d => setResults((d.data || []).filter((p: Part) => !excludeIds.includes(p.id))))
      .catch(() => setResults([]))
      .finally(() => setSearching(false));
  }, [debouncedQuery, excludeIds]);

  const handleSelect = useCallback((p: Part) => {
    onSelect(p);
    setQuery('');
    setResults([]);
    setOpen(false);
  }, [onSelect]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Pretraži delove..."
        style={{ width: '100%', padding: '8px 12px', background: '#0c0d0f', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
      />
      {open && query.length >= 2 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20, background: '#1a1b1f', border: '1px solid #333', borderRadius: '0 0 8px 8px', maxHeight: '200px', overflowY: 'auto' }}>
          {searching && <div style={{ padding: '10px', color: '#888', fontSize: '12px' }}>Pretražujem...</div>}
          {!searching && results.length === 0 && <div style={{ padding: '10px', color: '#666', fontSize: '12px' }}>Nema rezultata</div>}
          {results.map(p => (
            <div
              key={p.id}
              onClick={() => handleSelect(p)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #252629', transition: 'background 0.1s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#252629')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ color: '#fff', fontSize: '13px' }}>{(p.name_sr || p.name).slice(0, 40)}</span>
              <span style={{ color: '#ff4d00', fontSize: '13px', fontWeight: 600, flexShrink: 0, marginLeft: '8px' }}>{p.price?.toLocaleString('sr-RS')} RSD</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ComparisonContent() {
  const searchParams = useSearchParams();
  const initialIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds.slice(0, 3));
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedIds.length === 0) { setParts([]); return; }
    setLoading(true);
    Promise.all(selectedIds.map(id => fetch(`/api/parts/${id}`).then(r => r.json()).then(d => d.data || d)))
      .then(results => setParts(results.filter(Boolean)))
      .catch(() => setParts([]))
      .finally(() => setLoading(false));
  }, [selectedIds]);

  const addPart = useCallback((p: Part) => {
    setSelectedIds(prev => {
      if (prev.length >= 3 || prev.includes(p.id)) return prev;
      return [...prev, p.id];
    });
  }, []);

  const removePart = (id: string) => setSelectedIds(selectedIds.filter(x => x !== id));

  const s = {
    page: { background: '#0c0d0f', minHeight: '100vh' } as React.CSSProperties,
    container: { maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' } as React.CSSProperties,
    th: { padding: '12px 16px', background: '#1a1b1f', color: '#aaa', fontSize: '13px', fontWeight: 600, textAlign: 'left' as const, borderBottom: '1px solid #252629' },
    td: { padding: '12px 16px', borderBottom: '1px solid #1a1b1f', fontSize: '14px' },
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800 }}>Poređenje delova</h1>
          <Link href="/marketplace" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>← Nazad</Link>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .compare-slots { grid-template-columns: 1fr !important; }
            .compare-table { font-size: 12px !important; }
            .compare-table th, .compare-table td { padding: 8px 10px !important; }
          }
        `}</style>

        {/* Part selector */}
        <div className="compare-slots" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {Array.from({ length: 3 }).map((_, i) => {
            const part = parts[i];
            return (
              <div key={i} style={{ background: '#1a1b1f', borderRadius: '12px', padding: '16px', border: '1px solid #252629', textAlign: 'center', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {part ? (
                  <>
                    <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{part.name_sr || part.name}</p>
                    <p style={{ color: '#ff4d00', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>{part.price?.toLocaleString('sr-RS')} RSD</p>
                    <button onClick={() => removePart(part.id)} style={{ padding: '6px 12px', background: '#333', border: 'none', borderRadius: '6px', color: '#aaa', cursor: 'pointer', fontSize: '12px' }}>Ukloni</button>
                  </>
                ) : (
                  <>
                    <p style={{ color: '#555', fontSize: '14px', marginBottom: '8px' }}>+ Dodaj deo</p>
                    <PartSearchDropdown onSelect={addPart} excludeIds={selectedIds} />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {parts.length === 0 && selectedIds.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '64px', marginBottom: '16px' }}>⚖️</p>
            <p style={{ color: '#aaa', marginBottom: '16px' }}>Izaberite do 3 dela za poređenje koristeći polja iznad</p>
            <Link href="/marketplace" style={{ color: '#ff4d00', textDecoration: 'none', fontSize: '14px' }}>← Nazad na marketplace</Link>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#aaa' }}>Učitavanje...</div>
        )}

        {/* Comparison table */}
        {parts.length > 0 && !loading && (
          <div style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'auto', border: '1px solid #252629' }}>
            <table className="compare-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
              <thead>
                <tr>
                  <th style={s.th}>Karakteristika</th>
                  {parts.map(p => <th key={p.id} style={s.th}>{p.name_sr || p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {ATTRS.map(attr => {
                  const vals = parts.map(p => (p as unknown as Record<string, unknown>)[attr.key]);
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
