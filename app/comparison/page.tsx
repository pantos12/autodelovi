'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { mockParts, Part } from '../lib/data';

const ATTRS = [
  { key: 'nameSr', label: 'Naziv dela' },
  { key: 'category', label: 'Kategorija' },
  { key: 'make', label: 'Marka vozila' },
  { key: 'model', label: 'Model vozila' },
  { key: 'yearFrom', label: 'Godina od' },
  { key: 'yearTo', label: 'Godina do' },
  { key: 'oem', label: 'OEM broj' },
  { key: 'price', label: 'Cena (RSD)' },
  { key: 'supplier', label: 'Dobavljac' },
  { key: 'inStock', label: 'Na stanju' },
  { key: 'description', label: 'Opis' },
];

export default function ComparisonPage() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids');
  const initialIds = idsParam ? idsParam.split(',').slice(0, 3) : [];

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [search, setSearch] = useState('');

  const selectedParts = selectedIds.map(id => mockParts.find(p => p.id === id)).filter(Boolean) as Part[];
  const availableParts = mockParts.filter(p => !selectedIds.includes(p.id));
  const filteredAvailable = search ? availableParts.filter(p => p.nameSr.toLowerCase().includes(search.toLowerCase()) || p.make.toLowerCase().includes(search.toLowerCase())) : availableParts;

  function addPart(id: string) {
    if (selectedIds.length < 3) setSelectedIds([...selectedIds, id]);
  }
  function removePart(id: string) {
    setSelectedIds(selectedIds.filter(x => x !== id));
  }

  function getCellStyle(values: string[], idx: number): React.CSSProperties {
    if (values.length < 2) return {};
    const allSame = values.every(v => v === values[0]);
    if (allSame) return { color: 'rgba(255,255,255,0.7)' };
    const val = values[idx];
    const numVals = values.map(Number).filter(n => !isNaN(n));
    if (numVals.length === values.length) {
      const max = Math.max(...numVals);
      const min = Math.min(...numVals);
      if (Number(val) === min && min !== max) return { color: '#4ade80', fontWeight: 600 };
      if (Number(val) === max && min !== max) return { color: '#f87171', fontWeight: 600 };
    }
    return {};
  }

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: '64px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(12,13,15,0.95)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link href="/marketplace" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>MARKETPLACE</Link>
          <Link href="/suppliers" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>DOBAVLJACI</Link>
          <Link href="/vehicle-selection" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', letterSpacing: '1px', textDecoration: 'none' }}>IZBOR VOZILA</Link>
          <Link href="/comparison" style={{ color: '#f9372c', fontWeight: 600, fontSize: '13px', letterSpacing: '1px', textDecoration: 'none', borderBottom: '2px solid #f9372c', paddingBottom: '2px' }}>POREDENJE</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>Poredenje delova</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Uporedite do 3 dela istovremeno. Zelena = bolja cena, crvena = skuplji deo.</p>
        </div>

        {/* Part selector */}
        {selectedIds.length < 3 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'rgba(255,255,255,0.6)' }}>Dodajte deo za poredenje ({selectedIds.length}/3)</h3>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pretrazite delove..." style={{ width: '100%', background: '#1a1c1e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {filteredAvailable.slice(0, 12).map(p => (
                <button key={p.id} onClick={() => addPart(p.id)} style={{ textAlign: 'left', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px', transition: 'border-color 0.15s' }}>
                  <div style={{ fontWeight: 600, marginBottom: '2px' }}>{p.nameSr}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{p.make} {p.model} — {p.price.toLocaleString('sr-RS')} RSD</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comparison table */}
        {selectedParts.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: 'rgba(255,255,255,0.35)', fontWeight: 500, fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', width: '160px' }}>Atribut</th>
                  {selectedParts.map((p, i) => (
                    <th key={p.id} style={{ padding: '12px 16px', textAlign: 'left', background: 'rgba(255,255,255,0.04)', borderLeft: '1px solid rgba(255,255,255,0.08)', minWidth: '240px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>{p.nameSr}</span>
                        <button onClick={() => removePart(p.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '16px', padding: '0 4px' }}>×</button>
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{p.make} {p.model}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ATTRS.map((attr, attrIdx) => {
                  const values = selectedParts.map(p => {
                    const v = (p as any)[attr.key];
                    if (attr.key === 'inStock') return v ? 'Da' : 'Ne';
                    return String(v);
                  });
                  return (
                    <tr key={attr.key} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: attrIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>{attr.label}</td>
                      {values.map((v, i) => (
                        <td key={i} style={{ padding: '12px 16px', borderLeft: '1px solid rgba(255,255,255,0.06)', ...getCellStyle(values, i) }}>
                          {attr.key === 'price' ? Number(v).toLocaleString('sr-RS') + ' RSD' : v}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚖️</div>
            <p style={{ marginBottom: '16px' }}>Dodajte delove gore za poredenje</p>
            <Link href="/marketplace" style={{ color: '#f9372c', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Pregledajte marketplace →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
