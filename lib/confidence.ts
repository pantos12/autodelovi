// ============================================================
// autodelovi.sale - Stock-confidence band (pure, read-time)
// ============================================================

export type Band = 'verified' | 'likely' | 'inquiry';

export interface OfferSignal {
  last_seen_at: string | Date;
  stock_signal_strength: 'strong' | 'weak' | 'negative';
  last_check_status: 'ok' | 'not_found' | 'blocked' | 'timeout';
}

/**
 * Compute a stock-confidence band for an offer at read time.
 *
 * Rules (exact):
 *  - not_found | blocked | strength==='negative' | ageHours > 48  -> inquiry
 *  - ageHours <= 6  AND strength==='strong'                       -> verified
 *  - (ageHours <= 48 AND strong) OR (ageHours <= 6 AND weak)      -> likely
 *  - else                                                         -> inquiry
 */
export function computeBand(offer: OfferSignal, now: Date = new Date()): Band {
  const seen = offer.last_seen_at instanceof Date
    ? offer.last_seen_at
    : new Date(offer.last_seen_at);
  const ageMs = now.getTime() - seen.getTime();
  const ageHours = ageMs / 3_600_000;

  if (
    offer.last_check_status === 'not_found' ||
    offer.last_check_status === 'blocked' ||
    offer.stock_signal_strength === 'negative' ||
    ageHours > 48
  ) {
    return 'inquiry';
  }

  if (ageHours <= 6 && offer.stock_signal_strength === 'strong') {
    return 'verified';
  }

  if (
    (ageHours <= 48 && offer.stock_signal_strength === 'strong') ||
    (ageHours <= 6 && offer.stock_signal_strength === 'weak')
  ) {
    return 'likely';
  }

  return 'inquiry';
}

export function bandLabel(band: Band): string {
  switch (band) {
    case 'verified': return 'Na stanju \u00b7 provereno';
    case 'likely':   return 'Verovatno dostupno';
    case 'inquiry':  return 'Proveri sa prodavcem';
  }
}

export function bandEmoji(band: Band): string {
  switch (band) {
    case 'verified': return '\uD83D\uDFE2';
    case 'likely':   return '\uD83D\uDFE1';
    case 'inquiry':  return '\uD83D\uDD34';
  }
}
