'use client';
import { useState } from 'react';
import { addToCart, type CartItem } from '@/lib/cart';
import type { Part } from '@/lib/types';

interface Props {
  part: Part;
  label?: string;
  full?: boolean;
  /** Backwards-compat: disable button when out of stock */
  inStock?: boolean;
}

export default function AddToCartButton({ part, label, full, inStock }: Props) {
  const [added, setAdded] = useState(false);

  const disabled = inStock === false;

  function handleAdd() {
    if (disabled) return;
    const item: CartItem = {
      part_id: part.id,
      quantity: 1,
      name: part.name_sr || part.name,
      brand: part.brand || '',
      price: part.price,
      price_currency: part.price_currency || 'RSD',
      image_url: part.images?.[0] ?? null,
      supplier_id: part.supplier_id || '',
      supplier_name: part.supplier?.name ?? '',
      part_number: part.part_number || '',
    };
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const baseStyle: React.CSSProperties = full
    ? {
        width: '100%',
        padding: '14px 20px',
        background: disabled ? '#3a3a3a' : added ? '#22c55e' : '#f9372c',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s',
        letterSpacing: '0.3px',
      }
    : {
        padding: '8px 14px',
        background: disabled ? '#3a3a3a' : added ? '#22c55e' : '#1a1b1f',
        color: '#fff',
        border: `1px solid ${disabled ? '#3a3a3a' : added ? '#22c55e' : '#f9372c'}`,
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
      };

  const defaultLabel = disabled ? 'Nema na stanju' : label || 'Dodaj u korpu';

  return (
    <button onClick={handleAdd} disabled={disabled} style={baseStyle}>
      {added ? 'Dodato u korpu ✓' : defaultLabel}
    </button>
  );
}
