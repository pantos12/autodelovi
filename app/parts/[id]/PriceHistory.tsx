'use client';
import { useState, useEffect } from 'react';

interface PriceRecord {
  price: number;
  recorded_at: string;
}

interface Stats {
  min: number;
  max: number;
  avg: number;
  current: number;
  change_pct: number;
}

export default function PriceHistory({ partId, currentPrice }: { partId: string; currentPrice: number }) {
  const [history, setHistory] = useState<PriceRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/prices/${partId}?days=90`)
      .then(r => r.json())
      .then(json => {
        setHistory(json.data || []);
        setStats(json.stats || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [partId]);

  if (loading) {
    return (
      <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', border: '1px solid #252629', marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Istorija cena</h2>
        <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#666', fontSize: '13px' }}>Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (!stats || history.length < 2) return null;

  const prices = history.map(h => h.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const chartHeight = 60;

  return (
    <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', border: '1px solid #252629', marginBottom: '24px' }}>
      <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Istorija cena (90 dana)</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: '#0c0d0f', borderRadius: '8px', padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ color: '#22c55e', fontSize: '16px', fontWeight: 700 }}>{stats.min.toLocaleString('sr-RS')}</div>
          <div style={{ color: '#888', fontSize: '11px' }}>Najniža</div>
        </div>
        <div style={{ background: '#0c0d0f', borderRadius: '8px', padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>{Math.round(stats.avg).toLocaleString('sr-RS')}</div>
          <div style={{ color: '#888', fontSize: '11px' }}>Prosečna</div>
        </div>
        <div style={{ background: '#0c0d0f', borderRadius: '8px', padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ color: '#ef4444', fontSize: '16px', fontWeight: 700 }}>{stats.max.toLocaleString('sr-RS')}</div>
          <div style={{ color: '#888', fontSize: '11px' }}>Najviša</div>
        </div>
      </div>

      {/* Simple sparkline */}
      <div style={{ position: 'relative', height: `${chartHeight}px`, background: '#0c0d0f', borderRadius: '8px', padding: '8px', overflow: 'hidden' }}>
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${prices.length - 1} ${chartHeight}`} preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="#f9372c"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={prices.map((p, i) => `${i},${chartHeight - ((p - min) / range) * (chartHeight - 8) - 4}`).join(' ')}
          />
        </svg>
      </div>

      {stats.change_pct !== 0 && (
        <p style={{ color: stats.change_pct < 0 ? '#22c55e' : '#ef4444', fontSize: '12px', marginTop: '8px', textAlign: 'right' }}>
          {stats.change_pct > 0 ? '↑' : '↓'} {Math.abs(stats.change_pct).toFixed(1)}% u poslednjih 90 dana
        </p>
      )}
    </div>
  );
}
