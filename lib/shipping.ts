const FREE_SHIPPING_THRESHOLD = 10000;
const SHIPPING_FEE = 600;

export function calculateShipping(subtotal: number): { fee: number; isFree: boolean } {
  const isFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  return { fee: isFree ? 0 : SHIPPING_FEE, isFree };
}

export { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE };
