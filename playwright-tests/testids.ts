/**
 * Shared data-testid constants used across Playwright specs.
 *
 * All testids below are wired to their corresponding components:
 * - part-card      → app/components/PartCard.tsx (card root)
 * - band-badge     → app/components/PartCard.tsx (confidence badge)
 * - qty-inc/dec    → app/cart/page.tsx (cart qty stepper buttons)
 * - nav-cart-count  → app/components/NavBar.tsx (cart count in header)
 * - pagination-{n}  → app/marketplace/page.tsx (pagination buttons)
 * - compare-toggle  → app/components/PartCard.tsx (compare button)
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
