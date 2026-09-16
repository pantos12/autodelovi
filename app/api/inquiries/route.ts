import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60_000;

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
  const entry = rateLimit.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= RATE_LIMIT_MAX) {
      return bad('Too many requests. Please try again later.', 429);
    }
    entry.count++;
  } else {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
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
  if (email.length > 254) return bad('buyer_email is too long');

  if (typeof body.buyer_name === 'string' && body.buyer_name.length > 200) return bad('buyer_name is too long');
  if (typeof body.buyer_phone === 'string' && body.buyer_phone.length > 30) return bad('buyer_phone is too long');
  if (typeof body.message === 'string' && body.message.length > 2000) return bad('message is too long');

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
      return bad(`Failed to create inquiry: ${error?.message ?? 'unknown error'}`, 500);
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    console.error('[inquiries] Unhandled error:', message);
    return NextResponse.json({ error: 'Inquiry submission failed' }, { status: 500 });
  }
}
