export const SHIPPING_COST_RSD = 600;
export const FREE_SHIPPING_THRESHOLD_RSD = 10_000;

export function calcShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD_RSD ? 0 : SHIPPING_COST_RSD;
}
