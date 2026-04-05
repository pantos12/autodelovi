// @ts-nocheck
import { BaseScraper, fetchHTML } from '../base';
import type { ScrapedPart, ScrapeConfig } from '../../types';

// Halo Oglasi — Serbia's largest classifieds platform
// URL: https://www.halooglasi.com/vozila/delovi-i-oprema?stranica={n}

const CONFIG: ScrapeConfig = {
  type: 'html',
  base_url: 'https://www.halooglasi.com',
  rate_limit_ms: 2000,
  pagination: { type: 'page_number', param: 'stranica', max_pages: 10 },
};

const CATEGORY_KEYWORDS = [
  { keywords: ['filter', 'ulje', 'vazduh', 'gorivo', 'kabina'], hint: 'filters' },
  { keywords: ['disk', 'kocnic', 'plocic', 'bubanj'], hint: 'brakes' },
  { keywords: ['amortizer', 'opruga', 'stabilizator', 'trapez'], hint: 'suspension' },
  { keywords: ['svecic', 'paljenje', 'bobina', 'alternator', 'starter'], hint: 'electrical' },
  { keywords: ['kvacilo', 'zamajac', 'potisni'], hint: 'clutch' },
  { keywords: ['pumpa vode', 'termostat', 'hladnjak', 'rashladn'], hint: 'cooling' },
  { keywords: ['kaisni', 'kaish', 'razvodni'], hint: 'timing' },
  { keywords: ['karoserija', 'vrata', 'hauba', 'blatobran', 'branik'], hint: 'body' },
  { keywords: ['menjac', 'kardano', 'diferencial'], hint: 'transmission' },
];

const KNOWN_BRANDS = ['Bosch','SKF','Monroe','Brembo','NGK','Febi','Mann','Mahle','Sachs','TRW','Denso','Delphi','Valeo','Continental','Gates','Ate','LUK','INA','Hella','Filtron','KYB','Bilstein'];

function guessCategoryHint(text) {
  const lower = text.toLowerCase();
  for (const cat of CATEGORY_KEYWORDS) {
    if (cat.keywords.some(k => lower.includes(k))) return cat.hint;
  }
  return '';
}

function extractBrandFromText(text) {
