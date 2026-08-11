import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Porudzbina',
  robots: { index: false, follow: false },
};

interface OrderItem {
  id: string;
  part_id: string;
  part_name: string;
  brand: string | null;
  part_number: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
  image_url: string | null;
  supplier_name: string | null;
}

interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_postal: string | null;
  notes: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  currency: string;
  created_at: string;
  order_items_v2: OrderItem[];
}

async function getOrder(id: string): Promise<OrderRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;

  const { data, error } = await supabaseAdmin
    .from('orders_v2')
    .select(`
      id, order_number, status, buyer_name, buyer_email, buyer_phone,
      shipping_address, shipping_city, shipping_postal, notes,
      subtotal, shipping_fee, total, currency, created_at,
      order_items_v2 (
        id, part_id, part_name, brand, part_number, quantity,
        unit_price, line_total, image_url, supplier_name
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as unknown as OrderRow;
}

async function getAuthenticatedEmail(): Promise<string | null> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return null;

    const cookieStore = cookies();
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
      },
    });
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email ?? null;
  } catch {
    return null;
  }
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***@***';
  return local.slice(0, 2) + '***@' + domain;
}

function maskPhone(phone: string): string {
  if (phone.length <= 4) return '***';
  return phone.slice(0, 3) + '****' + phone.slice(-2);
}

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);
  if (!order) notFound();

  const authEmail = await getAuthenticatedEmail();
  const isOwner = authEmail !== null && authEmail.toLowerCase() === order.buyer_email.toLowerCase();

  const paid = order.status === 'paid';
  const currency = order.currency || 'RSD';
  const items = order.order_items_v2 || [];

  const displayEmail = isOwner ? order.buyer_email : maskEmail(order.buyer_email);
  const displayPhone = order.buyer_phone
    ? (isOwner ? order.buyer_phone : maskPhone(order.buyer_phone))
    : null;
  const displayName = isOwner ? order.buyer_name : order.buyer_name.split(' ')[0] + ' ***';

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link href="/marketplace" style={{ color: '#aaa', fontSize: '13px', textDecoration: 'none' }}>← Nazad na marketplace</Link>
        </div>

        {/* Header card */}
        <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '24px', border: '1px solid #2a2b2f', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#aaa', fontSize: '13px', marginBottom: '4px' }}>Broj porudzbine</div>
              <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: 0 }}>{order.order_number}</h1>
              <div style={{ color: '#888', fontSize: '12px', marginTop: '6px' }}>
                {new Date(order.created_at).toLocaleString('sr-RS')}
              </div>
            </div>
            <div>
              {paid ? (
                <span style={{ display: 'inline-block', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#22c55e', padding: '8px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 }}>
                  ✓ Placanje potvrdjeno
                </span>
              ) : (
                <span style={{ display: 'inline-block', background: 'rgba(249, 158, 44, 0.12)', border: '1px solid #f99e2c', color: '#f99e2c', padding: '8px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 }}>
                  Ceka se uplata
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buyer + Shipping */}
        <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '24px', border: '1px solid #2a2b2f', marginBottom: '16px' }}>
          <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, margin: '0 0 14px' }}>Podaci o kupcu</h2>
          {!isOwner && (
            <div style={{ background: 'rgba(249,55,44,0.08)', border: '1px solid rgba(249,55,44,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '12px', color: '#f9372c' }}>
              Prijavite se sa email adresom narudzbine da vidite sve podatke.
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '13px' }}>
            <div>
              <div style={{ color: '#888', marginBottom: '2px' }}>Ime i prezime</div>
              <div style={{ color: '#fff' }}>{displayName}</div>
            </div>
            <div>
              <div style={{ color: '#888', marginBottom: '2px' }}>Email</div>
              <div style={{ color: '#fff' }}>{displayEmail}</div>
            </div>
            {displayPhone && (
              <div>
                <div style={{ color: '#888', marginBottom: '2px' }}>Telefon</div>
                <div style={{ color: '#fff' }}>{displayPhone}</div>
              </div>
            )}
          </div>
          {isOwner && (order.shipping_address || order.shipping_city) && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #2a2b2f' }}>
              <div style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>Adresa za dostavu</div>
              <div style={{ color: '#fff', fontSize: '14px' }}>
                {order.shipping_address}
                {order.shipping_city && <>, {order.shipping_city}</>}
                {order.shipping_postal && <> {order.shipping_postal}</>}
              </div>
            </div>
          )}
          {isOwner && order.notes && (
            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #2a2b2f' }}>
              <div style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>Napomena</div>
              <div style={{ color: '#fff', fontSize: '13px' }}>{order.notes}</div>
            </div>
          )}
        </div>

        {/* Items */}
        <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '24px', border: '1px solid #2a2b2f', marginBottom: '16px' }}>
          <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, margin: '0 0 14px' }}>Stavke</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '14px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #2a2b2f' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: '#252629', flexShrink: 0, overflow: 'hidden' }}>
                  {item.image_url
                    ? <img src={item.image_url} alt={item.part_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <img src="/images/part-placeholder.svg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{item.part_name}</div>
                  <div style={{ color: '#aaa', fontSize: '12px' }}>
                    {item.brand}{item.part_number ? ` · ${item.part_number}` : ''}
                  </div>
                  {item.supplier_name && <div style={{ color: '#888', fontSize: '11px', marginTop: '2px' }}>Dobavljač: {item.supplier_name}</div>}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: '#aaa', fontSize: '12px' }}>{item.quantity} × {item.unit_price.toLocaleString('sr-RS')} {currency}</div>
                  <div style={{ color: '#fff', fontSize: '15px', fontWeight: 700, marginTop: '2px' }}>
                    {item.line_total.toLocaleString('sr-RS')} {currency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '24px', border: '1px solid #2a2b2f' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#aaa', fontSize: '14px' }}>Subtotal</span>
            <span style={{ color: '#fff', fontSize: '14px' }}>{order.subtotal.toLocaleString('sr-RS')} {currency}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ color: '#aaa', fontSize: '14px' }}>Dostava</span>
            <span style={{ color: order.shipping_fee === 0 ? '#22c55e' : '#fff', fontSize: '14px' }}>
              {order.shipping_fee === 0 ? 'Besplatno' : `${order.shipping_fee.toLocaleString('sr-RS')} ${currency}`}
            </span>
          </div>
          <div style={{ height: '1px', background: '#2a2b2f', margin: '14px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>Ukupno</span>
            <span style={{ color: '#f9372c', fontSize: '22px', fontWeight: 800 }}>{order.total.toLocaleString('sr-RS')} {currency}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
