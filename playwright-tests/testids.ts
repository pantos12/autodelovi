/**
 * Shared data-testid constants used across Playwright specs.
 *
 * All testids are implemented in their corresponding components:
 *   - part-card: app/marketplace/page.tsx (card root)
 *   - band-badge: app/marketplace/page.tsx (BandBadge component)
 *   - qty-inc / qty-dec: app/cart/page.tsx (quantity stepper buttons)
 *   - nav-cart-count: app/components/NavBar.tsx (cart badge)
 *   - pagination-{n}: app/marketplace/page.tsx (pagination chips)
 *   - compare-toggle: app/marketplace/page.tsx (compare button)
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
