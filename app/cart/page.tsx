'use client';
import Link from 'next/link';
import { useCart } from '../components/CartProvider';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <span style={{ fontSize: '64px' }}>🛒</span>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700 }}>Korpa je prazna</h1>
        <p style={{ color: '#aaa', fontSize: '14px' }}>Dodajte delove iz marketplace-a</p>
        <Link href="/marketplace" style={{ marginTop: '12px', padding: '12px 32px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Pretrazi delove
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800 }}>Korpa ({items.length})</h1>
          <button onClick={clearCart} style={{ background: 'none', border: '1px solid #555', borderRadius: '8px', padding: '8px 16px', color: '#aaa', fontSize: '13px', cursor: 'pointer' }}>
            Isprazni korpu
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '16px', background: '#1a1b1f', borderRadius: '12px', padding: '16px', border: '1px solid #252629', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '8px', background: '#252629', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                {item.image
                  ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <img src="/images/part-placeholder.svg" alt="Auto deo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/parts/${item.slug || item.id}`} style={{ color: '#fff', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'block', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.name}
                </Link>
                <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>{item.brand}{item.supplier_name ? ` · ${item.supplier_name}` : ''}</p>
                <p style={{ color: '#ff4d00', fontSize: '16px', fontWeight: 700 }}>{item.price.toLocaleString('sr-RS')} RSD</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: '32px', height: '32px', background: '#252629', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ color: '#fff', fontSize: '15px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '32px', height: '32px', background: '#252629', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '18px', cursor: 'pointer', padding: '8px', flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', border: '1px solid #252629' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ color: '#aaa', fontSize: '16px' }}>Ukupno:</span>
            <span style={{ color: '#ff4d00', fontSize: '28px', fontWeight: 800 }}>{cartTotal.toLocaleString('sr-RS')} RSD</span>
          </div>
          <button style={{ width: '100%', padding: '14px', background: '#f9372c', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
            Nastavi ka plaćanju
          </button>
          <Link href="/marketplace" style={{ display: 'block', textAlign: 'center', marginTop: '12px', color: '#aaa', fontSize: '13px', textDecoration: 'none' }}>
            ← Nastavi kupovinu
          </Link>
        </div>
      </div>
    </div>
  );
}
