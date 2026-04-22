'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../components/CartProvider';
import { calculateShipping } from '@/lib/shipping';

export default function CartPage() {
  const { items, count, subtotal, updateQty, remove, clear } = useCart();

  const currency = items[0]?.price_currency || 'RSD';
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  if (!items || items.length === 0) {
    return (
      <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', fontFamily: 'Inter, "Helvetica Neue", sans-serif', padding: '24px' }}>
        <span style={{ fontSize: '64px' }}>🛒</span>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Korpa je prazna</h1>
        <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>Dodajte delove iz marketplace-a</p>
        <Link href="/marketplace" style={{ marginTop: '12px', padding: '12px 32px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Nastavi kupovinu
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <style>{`
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr !important; }
          .cart-summary { position: static !important; }
          .cart-item-row { flex-wrap: wrap !important; }
          .cart-item-actions { margin-left: auto; }
        }
      `}</style>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, margin: 0 }}>Vaša korpa <span style={{ color: '#aaa', fontWeight: 400, fontSize: '18px' }}>({count})</span></h1>
          <button onClick={clear} style={{ background: 'none', border: '1px solid #2a2b2f', borderRadius: '8px', padding: '8px 16px', color: '#aaa', fontSize: '13px', cursor: 'pointer' }}>
            Obriši korpu
          </button>
        </div>

        <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map(item => {
              const lineTotal = item.price * item.quantity;
              return (
                <div key={item.part_id} className="cart-item-row" style={{ display: 'flex', gap: '14px', background: '#1a1b1f', borderRadius: '12px', padding: '16px', border: '1px solid #2a2b2f', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '8px', background: '#252629', overflow: 'hidden', flexShrink: 0 }}>
                    <Image
                      src={item.image_url || '/images/part-placeholder.svg'}
                      alt={item.name}
                      fill
                      sizes="60px"
                      style={{ objectFit: 'cover' }}
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '2px' }}>{item.brand} · {item.part_number}</div>
                    <div style={{ color: '#888', fontSize: '11px', marginBottom: '6px' }}>Dobavljač: {item.supplier_name}</div>
                    <div style={{ color: '#f9372c', fontSize: '14px', fontWeight: 600 }}>{item.price.toLocaleString('sr-RS')} {item.price_currency}</div>
                  </div>
                  <div className="cart-item-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button data-testid="qty-dec" onClick={() => updateQty(item.part_id, Math.max(1, item.quantity - 1))} style={{ width: '28px', height: '28px', background: '#252629', border: '1px solid #2a2b2f', borderRadius: '6px', color: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                      <button data-testid="qty-inc" onClick={() => updateQty(item.part_id, item.quantity + 1)} style={{ width: '28px', height: '28px', background: '#252629', border: '1px solid #2a2b2f', borderRadius: '6px', color: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                    <div style={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}>{lineTotal.toLocaleString('sr-RS')} {item.price_currency}</div>
                    <button onClick={() => remove(item.part_id)} aria-label="Ukloni" style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '18px', cursor: 'pointer', padding: '2px 6px' }}>×</button>
                  </div>
                </div>
              );
            })}

            <Link href="/marketplace" style={{ display: 'inline-block', marginTop: '8px', color: '#aaa', fontSize: '13px', textDecoration: 'none' }}>
              ← Nastavi kupovinu
            </Link>
          </div>

          {/* Summary */}
          <div className="cart-summary" style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', border: '1px solid #2a2b2f', position: 'sticky', top: '80px' }}>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>Pregled porudžbine</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#aaa', fontSize: '14px' }}>Subtotal</span>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>{subtotal.toLocaleString('sr-RS')} {currency}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '12px' }}>
              <span style={{ color: '#aaa', fontSize: '14px' }}>Dostava</span>
              <span style={{ color: shipping === 0 ? '#22c55e' : '#fff', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>
                {shipping === 0 ? 'Besplatno na stanju' : `${shipping} RSD ostalo`}
              </span>
            </div>

            <div style={{ height: '1px', background: '#2a2b2f', margin: '14px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>Ukupno</span>
              <span style={{ color: '#f9372c', fontSize: '22px', fontWeight: 800 }}>{total.toLocaleString('sr-RS')} {currency}</span>
            </div>

            <Link href="/checkout" style={{ display: 'block', width: '100%', padding: '14px', background: '#f9372c', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', textAlign: 'center', boxSizing: 'border-box' }}>
              Poruči
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
