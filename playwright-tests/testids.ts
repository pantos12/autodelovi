/**
 * Shared data-testid constants used across Playwright specs.
 */
export const TESTIDS = {
  PART_CARD: 'part-card',
  BAND_BADGE: 'band-badge',
  QTY_INC: 'qty-inc',
  QTY_DEC: 'qty-dec',
  NAV_CART_COUNT: 'nav-cart-count',
  PAGINATION: (n: number) => `pagination-${n}`,
  COMPARE_TOGGLE: 'compare-toggle',
} as const;
