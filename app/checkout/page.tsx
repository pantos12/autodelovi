'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../components/CartProvider';

interface BuyerForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
  notes: string;
}

type PaymentMethod = 'stripe' | 'cod';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, count, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [form, setForm] = useState<BuyerForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal: '',
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

  function validateForm(): string | null {
    if (!form.name.trim()) return 'Unesite ime i prezime.';
    if (!form.email.trim() || !form.email.includes('@')) return 'Unesite validnu email adresu.';
    if (!form.phone.trim()) return 'Unesite broj telefona.';
    if (!form.address.trim()) return 'Unesite adresu za dostavu.';
    if (!form.city.trim()) return 'Unesite grad.';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      if (paymentMethod === 'stripe') {
        let session_id: string | null = null;
        if (typeof window !== 'undefined') {
          session_id = localStorage.getItem('ads_cart_session');
          if (!session_id) {
            session_id = `ads_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
            try { localStorage.setItem('ads_cart_session', session_id); } catch {}
          }
        }
        const res = await fetch('/api/checkout/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id,
            items: items.map(i => ({ part_id: i.part_id, quantity: i.quantity })),
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
      } else {
        const res = await fetch('/api/checkout/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_method: 'cod',
            items: items.map(i => ({ part_id: i.part_id, quantity: i.quantity, name: i.name, price: i.price, price_currency: i.price_currency })),
            buyer: form,
            total_rsd: total,
          }),
        });
        const json = await res.json();
        if (!res.ok || json.error) {
          throw new Error(json.error || `Greška (${res.status})`);
        }
        clear();
        if (json.order_id) {
          router.push(`/order/${json.order_id}`);
        } else {
          router.push('/');
        }
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
          <form onSubmit={handleSubmit}>
            <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '24px', border: '1px solid #2a2b2f', marginBottom: '16px' }}>
              <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: '0 0 18px' }}>Podaci o kupcu</h2>

              {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444', borderRadius: '8px', padding: '12px 14px', color: '#ef4444', fontSize: '13px', marginBottom: '18px' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Ime i prezime *</label>
                <input type="text" required value={form.name} onChange={e => update('name', e.target.value)} style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Telefon *</label>
                  <input type="tel" required value={form.phone} onChange={e => update('phone', e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Adresa za dostavu *</label>
                <input type="text" required value={form.address} onChange={e => update('address', e.target.value)} style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={labelStyle}>Grad *</label>
                  <input type="text" required value={form.city} onChange={e => update('city', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Poštanski broj</label>
                  <input type="text" value={form.postal} onChange={e => update('postal', e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Napomena</label>
                <textarea rows={3} value={form.notes} onChange={e => update('notes', e.target.value)} style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} />
              </div>
            </div>

            {/* Payment method selection */}
            <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '24px', border: '1px solid #2a2b2f', marginBottom: '16px' }}>
              <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>Način plaćanja</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                    background: paymentMethod === 'cod' ? 'rgba(249,55,44,0.08)' : '#0c0d0f',
                    border: paymentMethod === 'cod' ? '2px solid #f9372c' : '2px solid #2a2b2f',
                    borderRadius: '10px', cursor: 'pointer', transition: 'border-color 0.15s',
                  }}
                >
                  <input
                    type="radio" name="payment" value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    style={{ accentColor: '#f9372c', width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>Plaćanje pouzećem (COD)</div>
                    <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>Platite kuriru pri preuzimanju</div>
                  </div>
                </label>
                <label
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                    background: paymentMethod === 'stripe' ? 'rgba(249,55,44,0.08)' : '#0c0d0f',
                    border: paymentMethod === 'stripe' ? '2px solid #f9372c' : '2px solid #2a2b2f',
                    borderRadius: '10px', cursor: 'pointer', transition: 'border-color 0.15s',
                  }}
                >
                  <input
                    type="radio" name="payment" value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={() => setPaymentMethod('stripe')}
                    style={{ accentColor: '#f9372c', width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>Kartica (Stripe)</div>
                    <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>Visa, Mastercard, Amex — bezbedno online plaćanje</div>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" disabled={submitting} style={{ width: '100%', padding: '14px', background: submitting ? '#6b6b6b' : '#f9372c', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting
                ? 'Obrađuje se...'
                : paymentMethod === 'stripe'
                  ? 'Plati karticom preko Stripe-a'
                  : 'Poruči — plaćanje pouzećem'}
            </button>

            <p style={{ color: '#666', fontSize: '11px', textAlign: 'center', marginTop: '12px', marginBottom: 0 }}>
              {paymentMethod === 'stripe'
                ? 'Bezbedno plaćanje preko Stripe platforme'
                : 'Plaćate gotovinom ili karticom kuriru pri dostavi'}
            </p>
          </form>

          {/* Summary */}
          <div className="checkout-summary" style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', border: '1px solid #2a2b2f', position: 'sticky', top: '80px' }}>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, margin: '0 0 14px' }}>Porudžbina ({count})</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '320px', overflowY: 'auto' }}>
              {items.map(item => (
                <div key={item.part_id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: '#252629', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={item.image_url || '/images/part-placeholder.svg'}
                      alt={item.name || ''}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (!img.src.endsWith('/images/part-placeholder.svg')) {
                          img.src = '/images/part-placeholder.svg';
                        }
                      }}
                    />
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
                {shipping === 0 ? 'Besplatno' : `${shipping.toLocaleString('sr-RS')} ${currency}`}
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
