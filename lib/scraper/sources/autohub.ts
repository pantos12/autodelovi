// @ts-nocheck
import { BaseScraper, fetchHTML } from '../base';
import type { ScrapedPart, ScrapeConfig } from '../../types';

const CONFIG: ScrapeConfig = {
  type: 'html',
  base_url: 'https://www.autohub.rs',
  rate_limit_ms: 1500,
  pagination: { type: 'page_number', param: 'page', max_pages: 20 },
};

const AUTOHUB_CATEGORIES = [
  { slug: 'filteri',        hint: 'filters',      srLabel: 'Filteri' },
  { slug: 'kocnice',        hint: 'brakes',       srLabel: 'Kocnice' },
  { slug: 'amortizeri',     hint: 'suspension',   srLabel: 'Amortizeri' },
  { slug: 'svecice',        hint: 'ignition',     srLabel: 'Svecice' },
  { slug: 'elektrika',      hint: 'electrical',   srLabel: 'Elektrika' },
  { slug: 'kvacilo',        hint: 'clutch',       srLabel: 'Kvacilo' },
  { slug: 'hladjenje',      hint: 'cooling',      srLabel: 'Hladjenje' },
  { slug: 'distribucija',   hint: 'timing',       srLabel: 'Razvodni mehanizam' },
  { slug: 'ispusni-sistem', hint: 'exhaust',      srLabel: 'Ispusni sistem' },
  { slug: 'upravljanje',    hint: 'steering',     srLabel: 'Upravljanje' },
  { slug: 'menjac',         hint: 'transmission', srLabel: 'Menjac' },
  { slug: 'motor',          hint: 'engine',       srLabel: 'Motor' },
];

function parseAutoHubTitle(title) {
  const parts = title.split(/\s+-\s+/);
  if (parts.length >= 3) return { brand: parts[0].trim(), partNumber: parts[1].trim(), description: parts.slice(2).join(' - ').replace(/\s*\([^)]+\)\s*$/, '').trim() };
  if (parts.length === 2) return { brand: parts[0].trim(), partNumber: '', description: parts[1].trim() };
  return { brand: '', partNumber: '', description: title };
}

function parseProductsFromHTML(html, category, baseUrl, supplierId) {
  const parts = [];
  const now = new Date().toISOString();

