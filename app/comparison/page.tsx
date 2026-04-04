'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { mockParts, Part } from '../lib/data';

const ATTRS: { key: keyof Part; label: string }[] = [
  { key: 'price', label: 'Cena (RSD)' },
  { key: 'category', label: 'Kategorija' },
  { key: 'make', label: 'Marka' },
  { key: 'model', label: 'Model' },
  { key: 'yearFrom', label: 'Od godine' },
  { key: 'yearTo', label: 'Do godine' },
  { key: 'oem', label: 'OEM broj' },
  { key: 'supplier', label: 'Dobavljač' },
  { key: 'inStock', label: 'Na stanju' },
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

function ComparisonContent() {
  const searchParams = useSearchParams();
  const initialIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds.slice(0, 3));
  const [search, setSearch] = useState('');

  const parts = selectedIds.map(id => mockParts.find(p => p.id === id)).filter(Boolean) as Part[];
  const filtered = mockParts.filter(p =>
    p.nameSr.toLowerCase().includes(search.toLowerCase()) ||
    p.make.toLowerCase().includes(search.toLowerCase())
  );

  const addPart = (id: string) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };
  const removePart = (id: string) => setSelectedIds(selectedIds.filter(x => x !== id));

  const s = {
    page: { background: '#0c0d0f', minHeight: '100vh' } as React.CSSProperties,
    container: { maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' } as React.CSSProperties,
    input: { width: '100%', padding: '10px 14px', background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' as const },
    th: { padding: '12px 16px', background: '#1a1b1f', color: '#aaa', fontSize: '13px', fontWeight: 600, textAlign: 'left' as const, borderBottom: '1px solid #252629' },
    td: { padding: '12px 16px', borderBottom: '1px solid #1a1b1f', fontSize: '14px' },
  };

  if (parts.length === 0 && selectedIds.length === 0) {
    return (
      <div style={s.page}>
        <div style={{ ...s.container, textAlign: 'center', paddingTop: '80px' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>⚖️</p>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '12px' }}>Poređenje delova</h2>
          <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '32px' }}>Odaberite do 3 dela za poređenje iz marketplace-a.</p>
          <Link href="/marketplace" style={{ padding: '12px 28px', background: '#ff4d00', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>
            Idi na Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <style>{`
        .search-result-item { padding: 10px 14px; cursor: pointer; border-bottom: 1px solid #252629; color: #fff; font-size: 14px; }
        .search-result-item:hover { background: #252629; }
      `}</style>
      <div style={s.container}>
        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
          Poređenje <span style={{ color: '#ff4d00' }}>Delova</span>
        </h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '32px' }}>Uporedite do 3 dela istovremeno</p>

        {selectedIds.length < 3 && (
          <div style={{ marginBottom: '32px' }}>
            <input
              style={s.input}
              placeholder="Pretražite deo za dodavanje..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <div style={{ background: '#1a1b1f', borderRadius: '8px', marginTop: '8px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #333' }}>
                {filtered.slice(0, 10).map(p => (
                  <div
                    key={p.id}
                    className="search-result-item"
                    onClick={() => { addPart(p.id); setSearch(''); }}
                  >
                    {p.nameSr} — {p.make} {p.model} — {p.price.toLocaleString('sr-RS')} RSD
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#141517', borderRadius: '12px', overflow: 'hidden' }}>
            <thead>
              <tr>
                <th style={s.th}>Atribut</th>
                {parts.map(part => (
                  <th key={part.id} style={{ ...s.th, minWidth: '200px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#fff', fontSize: '15px' }}>{part.nameSr}</div>
                        <div style={{ color: '#aaa', fontSize: '12px', fontWeight: 400 }}>{part.make} {part.model}</div>
                      </div>
                      <button
                        onClick={() => removePart(part.id)}
                        style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '18px' }}
                      >×</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ATTRS.map(attr => {
                const vals = parts.map(p => p[attr.key]);
                return (
                  <tr key={attr.key}>
                    <td style={{ ...s.td, color: '#aaa', fontWeight: 600 }}>{attr.label}</td>
                    {parts.map(part => {
                      const val = part[attr.key];
                      const display = typeof val === 'boolean'
                        ? (val ? '✓ Da' : '✗ Ne')
                        : attr.key === 'price'
                        ? (val as number).toLocaleString('sr-RS') + ' RSD'
                        : String(val);
                      return (
                        <td key={part.id} style={{ ...s.td, ...getCellStyle(attr.key as string, val, vals) }}>
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr>
                <td style={{ ...s.td, color: '#aaa', fontWeight: 600 }}>Akcija</td>
                {parts.map(part => (
                  <td key={part.id} style={s.td}>
                    <Link
                      href={`/parts/${part.id}`}
                      style={{ padding: '8px 16px', background: '#ff4d00', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
                    >
                      Kupi
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
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
