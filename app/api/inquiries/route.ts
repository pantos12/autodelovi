import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const recentRequests = new Map<string, number>();

interface InquiryBody {
  part_id?: string;
  merchant_id?: string;
  buyer_name?: string;
  buyer_email?: string;
  buyer_phone?: string;
  message?: string;
}

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const lastRequest = recentRequests.get(ip);
  if (lastRequest && now - lastRequest < 10_000) {
    return bad('Previše zahteva. Sačekajte par sekundi.', 429);
  }
  recentRequests.set(ip, now);
  if (recentRequests.size > 10_000) {
    for (const [key, ts] of recentRequests) {
      if (now - ts > 60_000) recentRequests.delete(key);
    }
  }
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return bad('Invalid JSON body');
  }
  if (!raw || typeof raw !== 'object') return bad('Invalid request body');
  const body = raw as InquiryBody;

  const email = typeof body.buyer_email === 'string' ? body.buyer_email.trim() : '';
  if (!email) return bad('buyer_email is required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad('buyer_email is invalid');

  const part_id = typeof body.part_id === 'string' && body.part_id.trim() ? body.part_id.trim() : null;

  const payload = {
    part_id,
    merchant_id: typeof body.merchant_id === 'string' && body.merchant_id.trim() ? body.merchant_id.trim() : null,
    buyer_name: typeof body.buyer_name === 'string' && body.buyer_name.trim() ? body.buyer_name.trim() : null,
    buyer_email: email,
    buyer_phone: typeof body.buyer_phone === 'string' && body.buyer_phone.trim() ? body.buyer_phone.trim() : null,
    message: typeof body.message === 'string' && body.message.trim() ? body.message.trim() : null,
    status: 'new',
  };

  try {
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .insert(payload)
      .select('id')
      .single();

    if (error || !data) {
      console.error('[inquiries] DB error:', error?.message);
      return bad('Greška pri slanju upita. Pokušajte ponovo.', 500);
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    console.error('[inquiries] Unhandled error:', message);
    return NextResponse.json({ error: 'Inquiry submission failed' }, { status: 500 });
  }
}
