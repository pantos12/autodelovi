// @ts-nocheck
import { BaseScraper, fetchHTML } from '../base';
import type { ScrapedPart, ScrapeConfig } from '../../types';

// ProdajaDelova.rs — Inspira Grupa's auto parts platform

const CONFIG: ScrapeConfig = {
  type: 'html',
  base_url: 'https://www.prodajadelova.rs',
  rate_limit_ms: 2000,
  pagination: { type: 'page_number', param: 'page', max_pages: 10 },
};

const CATEGORY_PATHS = [
  { path: '/auto-delovi/filteri',    hint: 'filters',      label: 'Filteri' },
  { path: '/auto-delovi/kocnice',    hint: 'brakes',       label: 'Kocnice' },
  { path: '/auto-delovi/amortizeri', hint: 'suspension',   label: 'Amortizeri' },
  { path: '/auto-delovi/elektrika',  hint: 'electrical',   label: 'Elektrika' },
  { path: '/auto-delovi/motor',      hint: 'engine',       label: 'Motor' },
  { path: '/auto-delovi',            hint: '',             label: 'Svi delovi' },
];

const CATEGORY_KEYWORDS = [
  { keywords: ['filter', 'ulje', 'vazduh', 'gorivo'], hint: 'filters' },
  { keywords: ['disk', 'kocnic', 'plocic', 'bubanj'], hint: 'brakes' },
  { keywords: ['amortizer', 'opruga', 'stabilizator'], hint: 'suspension' },
  { keywords: ['svecic', 'alternator', 'starter', 'paljenje'], hint: 'electrical' },
  { keywords: ['kvacilo', 'zamajac'], hint: 'clutch' },
  { keywords: ['termostat', 'hladnjak', 'pumpa vode'], hint: 'cooling' },
  { keywords: ['karoserija', 'vrata', 'hauba', 'blatobran'], hint: 'body' },
  { keywords: ['menjac', 'kardano'], hint: 'transmission' },
];

const KNOWN_BRANDS = ['Bosch','SKF','Monroe','Brembo','NGK','Febi','Mann','Mahle','Sachs','TRW','Denso','Delphi','Valeo','Continental','Gates','Ate','LUK','INA','Hella','Filtron','KYB','Bilstein'];

function guessCategoryHint(text) {
  const lower = text.toLowerCase();
