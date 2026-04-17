import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const VPIC_TIMEOUT_MS = 6_000;
const SOURCE = 'nhtsa_vpic';

function nullIfEmpty(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s || s === '0') return null;
  return s;
}

function parseYear(v: unknown): number | null {
  const s = nullIfEmpty(v);
  if (!s) return null;
  const n = parseInt(s, 10);
  return Number.isFinite(n) && n > 1900 && n < 2100 ? n : null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { vin: string } }
) {
  const rawVin = (params.vin ?? '').replace(/\s+/g, '').toUpperCase();

  if (!VIN_RE.test(rawVin)) {
    return NextResponse.json({ error: 'Invalid VIN' }, { status: 400 });
  }

  const vin = rawVin;

  // 1) Check cache
  try {
    const { data: cached } = await supabaseAdmin
      .from('vin_cache')
      .select('vin, make, model, model_year, source, decoded_at')
      .eq('vin', vin)
      .maybeSingle();

    if (cached?.decoded_at) {
      const age = Date.now() - new Date(cached.decoded_at).getTime();
      if (age < CACHE_MAX_AGE_MS) {
        return NextResponse.json({
          vin,
          make: cached.make ?? null,
          model: cached.model ?? null,
          model_year: cached.model_year ?? null,
          source: cached.source ?? SOURCE,
          cached: true,
        });
      }
    }
  } catch {
    // cache read miss — proceed to vPIC
  }

  // 2) Fetch vPIC with timeout
  let rawPayload: unknown = null;
  let make: string | null = null;
  let model: string | null = null;
  let modelYear: number | null = null;
  let vpicOk = false;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), VPIC_TIMEOUT_MS);
    try {
      const res = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`,
        { signal: ctrl.signal }
      );
      if (res.ok) {
        const json = await res.json();
        rawPayload = json;
        const r = Array.isArray(json?.Results) && json.Results[0] ? json.Results[0] : null;
        if (r) {
          // allowlist: Make, Model, ModelYear, VehicleType, BodyClass
          make = nullIfEmpty(r.Make);
          model = nullIfEmpty(r.Model);
          modelYear = parseYear(r.ModelYear);
          // VehicleType/BodyClass are read but not surfaced in the response.
          vpicOk = true;
        }
      }
    } finally {
      clearTimeout(timer);
    }
  } catch {
    vpicOk = false;
  }

  // 3) Upsert cache (even on failure — write null row so we don't hammer vPIC)
  try {
    await supabaseAdmin.from('vin_cache').upsert(
      {
        vin,
        make,
        model,
        model_year: modelYear,
        raw_payload: rawPayload,
        source: SOURCE,
        decoded_at: new Date().toISOString(),
      },
      { onConflict: 'vin' }
    );
  } catch {
    // ignore cache write errors
  }

  if (!vpicOk) {
    return NextResponse.json({
      vin,
      make: null,
      model: null,
      model_year: null,
      source: SOURCE,
      cached: false,
      error: 'vPIC unavailable',
    });
  }

  return NextResponse.json({
    vin,
    make,
    model,
    model_year: modelYear,
    source: SOURCE,
    cached: false,
  });
}
