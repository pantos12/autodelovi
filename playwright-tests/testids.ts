/**
 * Shared data-testid constants used across Playwright specs.
 *
 * TDD note: these testids may not yet exist in components owned by other
 * agents. Where a testid is missing, tests will fail on first run — that is
 * the TDD contract. Grep this file and add the testid to the corresponding
 * component during merge cleanup.
 *
 * TODO(agent-1/2): add data-testid="part-card" to the repeated card root
 *   component (likely app/components/PartCard.tsx or similar).
 * TODO(agent-1/2): add data-testid="band-badge" to the 🟢/🟡/🔴 band badge
 *   element inside the card.
 * TODO(agent-3): add data-testid="qty-inc" and "qty-dec" to the cart qty
 *   stepper buttons in app/cart/page.tsx.
 * TODO(agent-2): add data-testid="nav-cart-count" to the cart count element
 *   inside app/components/NavBar.tsx.
 * TODO(agent-1): add data-testid="pagination-{n}" to marketplace pagination
 *   chips.
 * TODO(agent-1): add data-testid="compare-toggle" to the compare checkbox or
 *   toggle on part cards.
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
