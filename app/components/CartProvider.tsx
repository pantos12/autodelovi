'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  price_currency: string;
  image?: string;
  quantity: number;
  supplier_name?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('autodelovi-cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('autodelovi-cart', JSON.stringify(items));
    }
  }, [items, loaded]);

  function addToCart(item: Omit<CartItem, 'quantity'>) {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) return removeFromCart(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  }

  function clearCart() {
    setItems([]);
  }

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}
