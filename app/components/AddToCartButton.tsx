'use client';
import { useState } from 'react';
import { useCart } from './CartProvider';

interface Props {
  part: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    price: number;
    price_currency: string;
    image?: string;
    supplier_name?: string;
  };
  inStock: boolean;
}

export default function AddToCartButton({ part, inStock }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!inStock) return;
    addToCart(part);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={!inStock}
      style={{
        width: '100%',
        padding: '14px',
        background: added ? '#22c55e' : inStock ? '#ff4d00' : '#555',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '16px',
        fontWeight: 700,
        cursor: inStock ? 'pointer' : 'not-allowed',
        marginBottom: '12px',
        transition: 'background 0.2s',
      }}
    >
      {added ? '✓ Dodato u korpu!' : inStock ? '🛒 Dodaj u korpu' : 'Nema na stanju'}
    </button>
  );
}
