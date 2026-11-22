'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { clearCart } from '@/lib/cart';

export default function ClearCartOnSuccess() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('status') === 'success' || searchParams.get('status') === 'pending') {
      clearCart();
    }
  }, [searchParams]);

  return null;
}
