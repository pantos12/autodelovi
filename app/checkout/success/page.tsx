import Link from 'next/link';
import type { Metadata } from 'next';
import Stripe from 'stripe';

export const metadata: Metadata = {
  title: 'Uspešna kupovina',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

async function retrieveSession(sessionId: string) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || secret === 'sk_test_...') return null;
  try {
    const stripe = new Stripe(secret, { apiVersion: '2026-03-25.dahlia' });
    return await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
  } catch {
    return null;
  }
}

export default async function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams?.session_id;
  const session = sessionId ? await retrieveSession(sessionId) : null;
  const paid = session?.payment_status === 'paid';
  const amountTotal = session?.amount_total ? (session.amount_total / 100).toFixed(2) : null;
  const currency = session?.currency?.toUpperCase() || 'EUR';
  const email = session?.customer_details?.email;

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '480px', width: '100%', background: '#1a1b1f', borderRadius: '16px', padding: '40px', border: '1px solid #252629', textAlign: 'center' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: paid ? 'rgba(34,197,94,0.15)' : 'rgba(249,55,44,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: '40px',
        }}>
          {paid ? '✓' : '⏳'}
        </div>
        <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 800, marginBottom: '12px' }}>
          {paid ? 'Kupovina uspešna!' : 'Obrada kupovine...'}
        </h1>
        <p style={{ color: '#aaa', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
          {paid
            ? 'Hvala vam na kupovini. Uskoro ćete dobiti email sa potvrdom narudžbine.'
            : 'Vaša kupovina se obrađuje. Molimo sačekajte.'}
        </p>

        {session && (
          <div style={{ background: '#0c0d0f', borderRadius: '10px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
            {email && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#aaa', fontSize: '13px' }}>Email</span>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{email}</span>
              </div>
            )}
            {amountTotal && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#aaa', fontSize: '13px' }}>Iznos</span>
                <span style={{ color: '#f9372c', fontSize: '14px', fontWeight: 700 }}>{amountTotal} {currency}</span>
              </div>
            )}
            {session.id && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#aaa', fontSize: '13px' }}>Broj narudžbine</span>
                <span style={{ color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}>{session.id.slice(-12)}</span>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/marketplace" style={{ padding: '12px 28px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
            Nastavi kupovinu
          </Link>
          <Link href="/" style={{ padding: '12px 28px', background: '#252629', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Početna
          </Link>
        </div>
      </div>
    </div>
  );
}
