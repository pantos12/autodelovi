/**
 * Shared data-testid constants used across Playwright specs.
 *
 * All testids below are wired into their respective components:
 * - part-card: marketplace product card root (app/marketplace/page.tsx)
 * - band-badge: stock confidence badge (app/marketplace/page.tsx BandBadge)
 * - qty-inc/qty-dec: cart quantity steppers (app/cart/page.tsx)
 * - nav-cart-count: cart count badge in NavBar (app/components/NavBar.tsx)
 * - pagination-{n}: marketplace pagination buttons (app/marketplace/page.tsx)
 * - compare-toggle: compare button on product cards (app/marketplace/page.tsx)
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
