import { extractPrice, slugify } from './base';
import type { ScrapedPart, NormalizedPart, CompatibleVehicle, PartCondition } from '../types';

let EUR_RATE = 117.5;
export function setEurRate(rate: number) { if (rate > 50 && rate < 200) EUR_RATE = rate; }

const CATEGORY_SLUGS: Record<string, string> = {
  filters: 'filteri', brakes: 'kocnice', suspension: 'amortizeri',
  ignition: 'paljenje', timing: 'razvod', clutch: 'kvacilo',
  cooling: 'hladjenje', electrical: 'elektrika', exhaust: 'izduvni-sistem',
  steering: 'upravljac', transmission: 'menjac', body: 'karoserija',
};

const KNOWN_BRANDS = new Set([
  'Bosch','SKF','FAG','Monroe','Sachs','Brembo','NGK','Febi','Mahle','Mann',
  'Denso','Delphi','Valeo','Continental','Gates','TRW','Ate','LUK','INA',
  'NTK','Filtron','Hella','Pierburg','Lemforder','ZF','Moog','Tokico','KYB','Bilstein',
]);

export function normalizePart(raw: ScrapedPart): NormalizedPart | null {
  if (!raw.raw_name?.trim() || !raw.raw_price?.trim()) return null;
  const price = extractPrice(raw.raw_price);
  if (price <= 0) return null;
  const currency = detectCurrency(raw.raw_price);
  const priceRsd = currency === 'EUR' ? Math.round(price * EUR_RATE) : price;
  const priceEur = currency === 'EUR' ? price : parseFloat((price / EUR_RATE).toFixed(2));

  let confidence = 0.5;
  const brand = raw.brand || extractBrandFromName(raw.raw_name);
  if (KNOWN_BRANDS.has(brand)) confidence += 0.2;
  if (raw.part_number) confidence += 0.15;
  if (raw.image_urls?.length) confidence += 0.1;
  if (raw.description) confidence += 0.05;
  if (confidence < 0.4) return null;

  const name = cleanName(raw.raw_name, brand);
  const partNumber = raw.part_number || generatePartNumber(name, raw.supplier_id);
  const specs = extractSpecs(raw.raw_name, raw.description ?? '');
  const compatibleVehicles = extractCompatibleVehicles(raw.description ?? '');
  const condition = detectCondition(raw.raw_name, raw.description ?? '');
  const categoryId = CATEGORY_SLUGS[raw.category_hint ?? ''] ?? 'ostalo';

  return { ...raw, name, price: priceRsd, price_currency: 'RSD', price_eur: priceEur,
    category_id: categoryId, condition, specs, compatible_vehicles: compatibleVehicles, confidence };
}

export function normalizeAll(raws: ScrapedPart[]): { normalized: NormalizedPart[]; rejected: ScrapedPart[] } {
  const normalized: NormalizedPart[] = [];
  const rejected: ScrapedPart[] = [];
  for (const raw of raws) {
    const r = normalizePart(raw);
    if (r) normalized.push(r); else rejected.push(raw);
  }
  return { normalized, rejected };
}

function detectCurrency(raw: string): string { return /€|EUR/i.test(raw) ? 'EUR' : 'RSD'; }

function cleanName(raw: string, brand: string): string {
  return raw.trim().replace(/\s+[A-Z0-9]{6,}\s*$/, '').replace(/\s{2,}/g, ' ');
}

function extractBrandFromName(name: string): string {
  for (const brand of KNOWN_BRANDS) { if (name.toLowerCase().includes(brand.toLowerCase())) return brand; }
  const fw = name.split(/\s+/)[0];
  if (/^[A-Z][a-zA-Z-]{2,}$/.test(fw)) return fw;
  return '';
}

function extractSpecs(name: string, desc: string): Record<string, string> {
  const specs: Record<string, string> = {};
  const t = `${name} ${desc}`;
  const d = t.match(/[ØDd]\s*(\d+)\s*mm/); if (d) specs['Prečnik'] = `${d[1]} mm`;
  const th = t.match(/M(\d+)[x×](\d+(?:\.\d+)?)/); if (th) specs['Navoj'] = `M${th[1]}×${th[2]}`;
  const v = t.match(/(\d+)\s*[Vv](?:\s|$)/); if (v) specs['Napon'] = `${v[1]}V`;
  return specs;
}

function extractCompatibleVehicles(desc: string): CompatibleVehicle[] {
  const vehicles: CompatibleVehicle[] = [];
  const pat = /(?:za|für|for)\s+([A-Za-z\-]+)\s+([A-Za-z0-9\s]+?)\s+(\d{4})(?:\s*[-–]\s*(\d{4}))?/gi;
  for (const m of desc.matchAll(pat)) {
    vehicles.push({ make: m[1].trim(), model: m[2].trim(), year_from: parseInt(m[3]), year_to: m[4] ? parseInt(m[4]) : undefined });
  }
  return vehicles;
}

function detectCondition(name: string, desc: string): PartCondition {
  const t = `${name} ${desc}`.toLowerCase();
  if (/rablje|polovn|used/i.test(t)) return 'used';
  if (/regenerisan|renoviran|refurb/i.test(t)) return 'refurbished';
  return 'new';
}

function generatePartNumber(name: string, supplierId: string): string {
  const hash = Math.abs([...name].reduce((a,c) => (a*31+c.charCodeAt(0))|0,0)).toString(16).padStart(6,'0').toUpperCase();
  return `${supplierId.slice(0,4).toUpperCase()}-${hash}`;
}
