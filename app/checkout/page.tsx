'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../components/CartProvider';

interface BuyerForm {
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal: string;
  notes: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, count } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<BuyerForm>({
    buyer_name: '',
    buyer_email: '',
    buyer_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_postal: '',
    notes: '',
  });

  const currency = items[0]?.price_currency || 'RSD';
  const freeShippingThreshold = 10000;
  const shipping = subtotal >= freeShippingThreshold ? 0 : 600;
  const total = subtotal + shipping;

  useEffect(() => {
    if (items && items.length === 0) {
      router.replace('/cart');
    }
  }, [items, router]);

  function update<K extends keyof BuyerForm>(key: K, value: BuyerForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.buyer_name.trim() || !form.buyer_email.trim() || !form.buyer_phone.trim() || !form.shipping_address.trim() || !form.shipping_city.trim()) {
      setError('Molimo popunite sva obavezna polja.');
      return;
    }

    setSubmitting(true);
    try {
      const session_id = typeof window !== 'undefined' ? localStorage.getItem('ads_cart_session') : null;
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id,
          items,
          buyer: form,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || `Greška (${res.status})`);
      }
      if (json.url) {
        window.location.href = json.url;
      } else {
        throw new Error('Nedostaje URL za plaćanje.');
      }
    } catch (err: any) {
      setError(err?.message || 'Došlo je do greške. Pokušajte ponovo.');
      setSubmitting(false);
    }
  }

  if (!items || items.length === 0) {
    return (
      <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
        Preusmeravanje...
      </div>
    );
  }

  const labelStyle: React.CSSProperties = { color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: 500 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', background: '#0c0d0f', border: '1px solid #2a2b2f', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <style>{`
        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-summary { position: static !important; }
        }
        input:focus, textarea:focus { border-color: #f9372c !important; }
      `}</style>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link href="/cart" style={{ color: '#aaa', fontSize: '13px', textDecoration: 'none' }}>← Nazad u korpu</Link>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, margin: '8px 0 0' }}>Plaćanje</h1>
        </div>

        <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
          {/* Form */}
          <form onSubmit={handleSubmit} style={{ background: '#1a1b1f', borderRadius: '12px', padding: '24px', border: '1px solid #2a2b2f' }}>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: '0 0 18px' }}>Podaci o kupcu</h2>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444', borderRadius: '8px', padding: '12px 14px', color: '#ef4444', fontSize: '13px', marginBottom: '18px' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Ime i prezime *</label>
              <input type="text" required value={form.buyer_name} onChange={e => update('buyer_name', e.target.value)} style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" required value={form.buyer_email} onChange={e => update('buyer_email', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Telefon *</label>
                <input type="tel" required value={form.buyer_phone} onChange={e => update('buyer_phone', e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Adresa za dostavu *</label>
              <input type="text" required value={form.shipping_address} onChange={e => update('shipping_address', e.target.value)} style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Grad *</label>
                <input type="text" required value={form.shipping_city} onChange={e => update('shipping_city', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Poštanski broj</label>
                <input type="text" value={form.shipping_postal} onChange={e => update('shipping_postal', e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Napomena</label>
              <textarea rows={3} value={form.notes} onChange={e => update('notes', e.target.value)} style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} />
            </div>

            <button type="submit" disabled={submitting} style={{ width: '100%', padding: '14px', background: submitting ? '#6b6b6b' : '#f9372c', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Obrađuje se...' : 'Plati karticom preko Stripe-a'}
            </button>

            <p style={{ color: '#666', fontSize: '11px', textAlign: 'center', marginTop: '12px', marginBottom: 0 }}>
              Bezbedno plaćanje preko Stripe platforme
            </p>
          </form>

          {/* Summary */}
          <div className="checkout-summary" style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', border: '1px solid #2a2b2f', position: 'sticky', top: '80px' }}>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, margin: '0 0 14px' }}>Porudžbina ({count})</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '320px', overflowY: 'auto' }}>
              {items.map(item => (
                <div key={item.part_id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '6px', background: '#252629', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <img src="/images/part-placeholder.svg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    }
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#2a2b2f', color: '#fff', fontSize: '10px', fontWeight: 700, borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1a1b1f' }}>{item.quantity}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ color: '#888', fontSize: '11px' }}>{item.brand}</div>
                  </div>
                  <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>
                    {(item.price * item.quantity).toLocaleString('sr-RS')}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ height: '1px', background: '#2a2b2f', margin: '12px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#aaa', fontSize: '13px' }}>Subtotal</span>
              <span style={{ color: '#fff', fontSize: '13px' }}>{subtotal.toLocaleString('sr-RS')} {currency}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#aaa', fontSize: '13px' }}>Dostava</span>
              <span style={{ color: shipping === 0 ? '#22c55e' : '#fff', fontSize: '13px' }}>
                {shipping === 0 ? 'Besplatno' : `${shipping} ${currency}`}
              </span>
            </div>

            <div style={{ height: '1px', background: '#2a2b2f', margin: '12px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}>Ukupno</span>
              <span style={{ color: '#f9372c', fontSize: '20px', fontWeight: 800 }}>{total.toLocaleString('sr-RS')} {currency}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
