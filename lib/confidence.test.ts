// Run with: node --test lib/confidence.test.ts
// (Optional local check; not wired into CI.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeBand, bandLabel, bandEmoji, type OfferSignal } from './confidence';

const NOW = new Date('2026-04-16T12:00:00Z');
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 3_600_000).toISOString();

function mk(partial: Partial<OfferSignal>): OfferSignal {
  return {
    last_seen_at: hoursAgo(1),
    stock_signal_strength: 'strong',
    last_check_status: 'ok',
    ...partial,
  };
}

test('fresh + strong + ok -> verified', () => {
  assert.equal(computeBand(mk({ last_seen_at: hoursAgo(1) }), NOW), 'verified');
});

test('6h boundary + strong -> verified', () => {
  assert.equal(computeBand(mk({ last_seen_at: hoursAgo(6) }), NOW), 'verified');
});

test('fresh + weak -> likely', () => {
  assert.equal(
    computeBand(mk({ last_seen_at: hoursAgo(2), stock_signal_strength: 'weak' }), NOW),
    'likely'
  );
});

test('stale (24h) + strong -> likely', () => {
  assert.equal(computeBand(mk({ last_seen_at: hoursAgo(24) }), NOW), 'likely');
});

test('50h-old + strong -> inquiry (>48h rule)', () => {
  assert.equal(computeBand(mk({ last_seen_at: hoursAgo(50) }), NOW), 'inquiry');
});

test('negative strength overrides freshness -> inquiry', () => {
  assert.equal(
    computeBand(mk({ last_seen_at: hoursAgo(1), stock_signal_strength: 'negative' }), NOW),
    'inquiry'
  );
});

test('not_found status -> inquiry', () => {
  assert.equal(
    computeBand(mk({ last_seen_at: hoursAgo(1), last_check_status: 'not_found' }), NOW),
    'inquiry'
  );
});

test('weak + 24h -> inquiry (weak only valid <=6h)', () => {
  assert.equal(
    computeBand(mk({ last_seen_at: hoursAgo(24), stock_signal_strength: 'weak' }), NOW),
    'inquiry'
  );
});

test('labels & emoji', () => {
  assert.equal(bandLabel('verified'), 'Na stanju \u00b7 provereno');
  assert.equal(bandLabel('likely'), 'Verovatno dostupno');
  assert.equal(bandLabel('inquiry'), 'Proveri sa prodavcem');
  assert.equal(bandEmoji('verified'), '\uD83D\uDFE2');
  assert.equal(bandEmoji('likely'), '\uD83D\uDFE1');
  assert.equal(bandEmoji('inquiry'), '\uD83D\uDD34');
});
