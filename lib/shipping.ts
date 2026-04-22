export const FREE_SHIPPING_THRESHOLD = 10000;
export const STANDARD_SHIPPING_COST = 600;

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
}
