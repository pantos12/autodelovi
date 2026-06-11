import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

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

function orderToken(orderId: string, email: string): string {
  return createHash('sha256').update(`${orderId}:${email}`).digest('hex').slice(0, 16);
}

async function getOrder(id: string): Promise<OrderRow | null> {
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

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const order = await getOrder(params.id);
  if (!order) notFound();

  const expectedToken = orderToken(order.id, order.buyer_email);
  const provided = searchParams.token || searchParams.status;

  // Allow access if: token matches, or came from checkout redirect (has status param),
  // or order_id query param matches (Stripe redirect)
  const hasAccess = provided === expectedToken
    || searchParams.status === 'success'
    || searchParams.status === 'pending'
    || searchParams.order_id === order.id;

  if (!hasAccess) notFound();

  const paid = order.status === 'paid';
  const currency = order.currency || 'RSD';
  const items = order.order_items_v2 || [];

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link href="/marketplace" style={{ color: '#aaa', fontSize: '13px', textDecoration: 'none' }}>← Nazad na marketplace</Link>
        </div>

        {/* Success banner */}
        {searchParams.status === 'success' && (
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ color: '#22c55e', fontSize: '24px', marginBottom: '8px' }}>✓</p>
            <p style={{ color: '#22c55e', fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Hvala na porudžbini!</p>
            <p style={{ color: '#aaa', fontSize: '13px' }}>Primili smo vašu uplatu i obradićemo porudžbinu u najkraćem roku.</p>
          </div>
        )}

        {/* Header card */}
        <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '24px', border: '1px solid #2a2b2f', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#aaa', fontSize: '13px', marginBottom: '4px' }}>Broj porudžbine</div>
              <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: 0 }}>{order.order_number}</h1>
              <div style={{ color: '#888', fontSize: '12px', marginTop: '6px' }}>
                {new Date(order.created_at).toLocaleString('sr-RS')}
              </div>
            </div>
            <div>
              {paid ? (
                <span style={{ display: 'inline-block', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#22c55e', padding: '8px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 }}>
                  ✓ Plaćanje potvrđeno
                </span>
              ) : (
                <span style={{ display: 'inline-block', background: 'rgba(249, 158, 44, 0.12)', border: '1px solid #f99e2c', color: '#f99e2c', padding: '8px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 }}>
                  Čeka se uplata
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buyer + Shipping */}
        <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '24px', border: '1px solid #2a2b2f', marginBottom: '16px' }}>
          <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, margin: '0 0 14px' }}>Podaci o kupcu</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '13px' }}>
            <div>
              <div style={{ color: '#888', marginBottom: '2px' }}>Ime i prezime</div>
              <div style={{ color: '#fff' }}>{order.buyer_name}</div>
            </div>
            <div>
              <div style={{ color: '#888', marginBottom: '2px' }}>Email</div>
              <div style={{ color: '#fff' }}>{order.buyer_email}</div>
            </div>
            {order.buyer_phone && (
              <div>
                <div style={{ color: '#888', marginBottom: '2px' }}>Telefon</div>
                <div style={{ color: '#fff' }}>{order.buyer_phone}</div>
              </div>
            )}
          </div>
          {(order.shipping_address || order.shipping_city) && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #2a2b2f' }}>
              <div style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>Adresa za dostavu</div>
              <div style={{ color: '#fff', fontSize: '14px' }}>
                {order.shipping_address}
                {order.shipping_city && <>, {order.shipping_city}</>}
                {order.shipping_postal && <> {order.shipping_postal}</>}
              </div>
            </div>
          )}
          {order.notes && (
            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #2a2b2f' }}>
              <div style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>Napomena</div>
              <div style={{ color: '#fff', fontSize: '13px' }}>{order.notes}</div>
            </div>
          )}
        </div>

        {/* Items */}
        <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '24px', border: '1px solid #2a2b2f', marginBottom: '16px' }}>
          <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, margin: '0 0 14px' }}>Stavke ({items.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map((item, i) => (
              <div key={item.id} style={{ display: 'flex', gap: '14px', alignItems: 'center', paddingBottom: i < items.length - 1 ? '12px' : 0, borderBottom: i < items.length - 1 ? '1px solid #2a2b2f' : 'none' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: '#252629', flexShrink: 0, overflow: 'hidden' }}>
                  <img
                    src={item.image_url || '/images/part-placeholder.svg'}
                    alt={item.part_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
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

        {/* Continue shopping */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/marketplace" style={{ padding: '12px 32px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Nastavi kupovinu
          </Link>
        </div>
      </div>
    </div>
  );
}
