import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface InquiryBody {
  part_id?: string;
  merchant_id?: string;
  buyer_name?: string;
  buyer_email?: string;
  buyer_phone?: string;
  message?: string;
}

const recentRequests = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const count = recentRequests.get(key) ?? 0;
  if (count >= MAX_REQUESTS_PER_WINDOW) return true;
  recentRequests.set(key, count + 1);
  if (count === 0) {
    setTimeout(() => recentRequests.delete(key), RATE_LIMIT_WINDOW);
  }
  return false;
}

function isValidEmail(email: string): boolean {
  if (email.length > 254) return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || local.length > 64) return false;
  if (!domain || domain.length < 3) return false;
  if (!domain.includes('.')) return false;
  const domainParts = domain.split('.');
  if (domainParts.some(p => !p || p.length > 63)) return false;
  return /^[^\s@]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(email);
}

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return bad('Invalid JSON body');
  }
  if (!raw || typeof raw !== 'object') return bad('Invalid request body');
  const body = raw as InquiryBody;

  const email = typeof body.buyer_email === 'string' ? body.buyer_email.trim().toLowerCase() : '';
  if (!email) return bad('buyer_email is required');
  if (!isValidEmail(email)) return bad('buyer_email is invalid');

  const rateLimitKey = `${email}:${body.part_id || 'general'}`;
  if (isRateLimited(rateLimitKey)) {
    return bad('Previše zahteva. Pokušajte ponovo za minut.', 429);
  }

  const part_id = typeof body.part_id === 'string' && body.part_id.trim() ? body.part_id.trim() : null;

  const sanitize = (s: string) => s.replace(/[<>]/g, '');
  const name = typeof body.buyer_name === 'string' && body.buyer_name.trim() ? sanitize(body.buyer_name.trim()).slice(0, 200) : null;
  const phone = typeof body.buyer_phone === 'string' && body.buyer_phone.trim() ? body.buyer_phone.trim().replace(/[^\d+\-() ]/g, '').slice(0, 30) : null;
  const message = typeof body.message === 'string' && body.message.trim() ? sanitize(body.message.trim()).slice(0, 2000) : null;

  const payload = {
    part_id,
    merchant_id: typeof body.merchant_id === 'string' && body.merchant_id.trim() ? body.merchant_id.trim() : null,
    buyer_name: name,
    buyer_email: email,
    buyer_phone: phone,
    message,
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
