'use client';
import { useState, useEffect, Suspense } from 'react';
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

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function ComparisonContent() {
  const searchParams = useSearchParams();
  const initialIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds.slice(0, 3));
  const [parts, setParts] = useState<Part[]>([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Part[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    if (debouncedSearch.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    const controller = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(debouncedSearch.trim())}&per_page=10`, { signal: controller.signal })
      .then(r => r.json())
      .then(d => setSearchResults(d.data || []))
      .catch(() => {})
      .finally(() => setSearchLoading(false));
    return () => controller.abort();
  }, [debouncedSearch]);

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

  const searchDropdown = (
    <>
      {search.trim().length >= 2 && (
        <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '4px' }}>
          {searchLoading && <p style={{ color: '#888', fontSize: '12px', padding: '8px 0' }}>Pretraga...</p>}
          {!searchLoading && searchResults.length === 0 && debouncedSearch.trim().length >= 2 && (
            <p style={{ color: '#666', fontSize: '12px', padding: '8px 0' }}>Nema rezultata</p>
          )}
          {searchResults.filter(p => !selectedIds.includes(p.id)).map(p => (
            <div key={p.id} onClick={() => addPart(p.id)} style={{ padding: '8px 12px', background: '#252629', borderRadius: '6px', marginBottom: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#fff', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{p.name_sr || p.name}</span>
              <span style={{ color: '#ff4d00', fontSize: '13px', fontWeight: 600, flexShrink: 0 }}>{p.price?.toLocaleString('sr-RS')} RSD</span>
            </div>
          ))}
        </div>
      )}
    </>
  );

  if (parts.length === 0 && selectedIds.length === 0) {
    return (
      <div style={s.page}>
        <div style={{ ...s.container, textAlign: 'center', paddingTop: '80px' }}>
          <p style={{ fontSize: '64px', marginBottom: '16px' }}>⚖️</p>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Poređenje delova</h1>
          <p style={{ color: '#aaa', marginBottom: '32px' }}>Izaberite do 3 dela za poređenje</p>
          <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
            <input
              style={s.input}
              placeholder="Pretraži delove..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            {searchDropdown}
          </div>
          <Link href="/marketplace" style={{ color: '#ff4d00', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginTop: '24px' }}>← Nazad na marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800 }}>Poređenje delova</h1>
          <Link href="/marketplace" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>← Nazad</Link>
        </div>

        {/* Part selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
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
                ) : selectedIds.length < 3 ? (
                  <div style={{ width: '100%', textAlign: 'left' }}>
                    <p style={{ color: '#555', fontSize: '14px', marginBottom: '8px', textAlign: 'center' }}>+ Dodaj deo</p>
                    <input style={{ ...s.input, fontSize: '12px', padding: '6px 10px' }} placeholder="Pretraži..." value={search} onChange={e => setSearch(e.target.value)} />
                    {searchDropdown}
                  </div>
                ) : (
                  <p style={{ color: '#555', fontSize: '14px' }}>Slot {i + 1}</p>
                )}
              </div>
            );
          })}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>Učitavanje...</div>
        )}

        {/* Comparison table */}
        {!loading && parts.length > 0 && (
          <div style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'auto', border: '1px solid #252629' }}>
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
