export const FREE_SHIPPING_THRESHOLD = 10_000;
export const SHIPPING_FEE = 600;
export const CURRENCY = 'RSD';

export function computeShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
