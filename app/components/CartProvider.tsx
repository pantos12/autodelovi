'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  getCart,
  addToCart as addToCartLib,
  updateQuantity as updateQuantityLib,
  removeFromCart as removeFromCartLib,
  clearCart as clearCartLib,
  getCartTotal,
  type CartItem,
} from '@/lib/cart';

export type { CartItem };

interface CartContextType {
  items: CartItem[];
  count: number;
  subtotal: number;
  currency: string;
  refresh: () => void;
  addItem: (item: CartItem) => void;
  updateQty: (part_id: string, quantity: number) => void;
  remove: (part_id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState<{ subtotal: number; count: number; currency: string }>({
    subtotal: 0,
    count: 0,
    currency: 'RSD',
  });

  const refresh = useCallback(() => {
    const nextItems = getCart();
    setItems(nextItems);
    setTotals(getCartTotal());
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('cart:updated', handler);
    // also react to other tabs via storage
    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'ads_cart_items') refresh();
    };
    window.addEventListener('storage', storageHandler);
    return () => {
      window.removeEventListener('cart:updated', handler);
      window.removeEventListener('storage', storageHandler);
    };
  }, [refresh]);

  const addItem = useCallback((item: CartItem) => {
    addToCartLib(item);
  }, []);

  const updateQty = useCallback((part_id: string, quantity: number) => {
    updateQuantityLib(part_id, quantity);
  }, []);

  const remove = useCallback((part_id: string) => {
    removeFromCartLib(part_id);
  }, []);

  const clear = useCallback(() => {
    clearCartLib();
  }, []);

  const value: CartContextType = {
    items,
    count: totals.count,
    subtotal: totals.subtotal,
    currency: totals.currency,
    refresh,
    addItem,
    updateQty,
    remove,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
