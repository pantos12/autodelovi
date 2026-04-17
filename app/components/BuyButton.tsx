'use client';
import { useState } from 'react';

interface BuyButtonProps {
  partId: string;
  inStock: boolean;
  stockQuantity: number;
}

export default function BuyButton({ partId, inStock, stockQuantity }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const maxQty = Math.min(stockQuantity, 10);

  async function handleCheckout() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ part_id: partId, quantity }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Greška pri pokretanju kupovine');
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'Greška pri pokretanju kupovine');
      setLoading(false);
    }
  }

  if (!inStock) {
    return (
      <button
        disabled
        style={{
          width: '100%', padding: '14px', background: '#555', border: 'none',
          borderRadius: '10px', color: '#fff', fontSize: '16px', fontWeight: 700,
          cursor: 'not-allowed', marginBottom: '12px',
        }}
      >
        Nema na stanju
      </button>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <label style={{ color: '#aaa', fontSize: '13px' }}>Količina:</label>
        <div style={{ display: 'flex', alignItems: 'center', background: '#0c0d0f', borderRadius: '8px', border: '1px solid #333' }}>
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1 || loading}
            style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: quantity <= 1 ? 'not-allowed' : 'pointer' }}
            aria-label="Smanji količinu"
          >−</button>
          <span style={{ minWidth: '28px', textAlign: 'center', color: '#fff', fontSize: '14px', fontWeight: 600 }}>{quantity}</span>
          <button
            onClick={() => setQuantity(q => Math.min(maxQty, q + 1))}
            disabled={quantity >= maxQty || loading}
            style={{ width: '32px', height: '32px', background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: quantity >= maxQty ? 'not-allowed' : 'pointer' }}
            aria-label="Povećaj količinu"
          >+</button>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          width: '100%', padding: '14px',
          background: loading ? '#666' : '#f9372c',
          border: 'none', borderRadius: '10px', color: '#fff',
          fontSize: '16px', fontWeight: 700,
          cursor: loading ? 'wait' : 'pointer',
          marginBottom: '12px',
          transition: 'background 0.2s',
        }}
      >
        {loading ? 'Učitavanje...' : '🛒 Kupi sada'}
      </button>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '8px', padding: '10px', color: '#ef4444', fontSize: '13px', marginBottom: '12px',
        }}>
          {error}
        </div>
      )}
    </>
  );
}
