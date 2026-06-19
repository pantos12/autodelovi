// ============================================================
// autodelovi.sale — Cart Library (pure, isomorphic, SSR-safe)
// ============================================================

export interface CartItem {
  part_id: string;
  quantity: number;
  name: string;
  brand: string;
  price: number;
  price_currency: string;
  image_url: string | null;
  supplier_id: string;
  supplier_name: string;
  part_number: string;
}

const SESSION_KEY = 'ads_cart_session';
const ITEMS_KEY = 'ads_cart_items';

// ─── Internal helpers ───────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function emitUpdate(): void {
  if (!isBrowser()) return;
  try {
    window.dispatchEvent(new CustomEvent('cart:updated'));
  } catch {
    /* noop */
  }
}

function readItems(): CartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(ITEMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

function writeItems(items: CartItem[]): CartItem[] {
  if (!isBrowser()) return items;
  try {
    window.localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch {
    /* noop */
  }
  emitUpdate();
  return items;
}

// ─── Session ────────────────────────────────────────────────

export function getSessionId(): string {
  if (!isBrowser()) return '';
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `sess_${Date.now().toString(36)}_${Array.from(crypto.getRandomValues(new Uint8Array(8)), b => b.toString(16).padStart(2, '0')).join('')}`;
    window.localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return '';
  }
}

// ─── Debounced sync ────────────────────────────────────────

let syncTimer: ReturnType<typeof setTimeout> | undefined;
function debouncedSync(items: CartItem[]): void {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncToSupabase(items).catch(() => {});
  }, 1000);
}

// ─── Cart operations ────────────────────────────────────────

export function getCart(): CartItem[] {
  return readItems();
}

export function addToCart(item: CartItem): CartItem[] {
  const items = readItems();
  const idx = items.findIndex(i => i.part_id === item.part_id);
  if (idx >= 0) {
    items[idx] = {
      ...items[idx],
      quantity: items[idx].quantity + (item.quantity || 1),
    };
  } else {
    items.push({ ...item, quantity: item.quantity || 1 });
  }
  const next = writeItems(items);
  debouncedSync(next);
  return next;
}

export function updateQuantity(part_id: string, quantity: number): CartItem[] {
  const items = readItems();
  let next: CartItem[];
  if (quantity <= 0) {
    next = items.filter(i => i.part_id !== part_id);
  } else {
    next = items.map(i => (i.part_id === part_id ? { ...i, quantity } : i));
  }
  const written = writeItems(next);
  debouncedSync(written);
  return written;
}

export function removeFromCart(part_id: string): CartItem[] {
  const next = readItems().filter(i => i.part_id !== part_id);
  const written = writeItems(next);
  debouncedSync(written);
  return written;
}

export function clearCart(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(ITEMS_KEY);
  } catch {
    /* noop */
  }
  emitUpdate();
  clearTimeout(syncTimer);
  syncToSupabase([]).catch(() => {});
}

export function getCartTotal(): { subtotal: number; count: number; currency: string } {
  const items = readItems();
  let subtotal = 0;
  let count = 0;
  let currency = 'RSD';
  for (const it of items) {
    subtotal += (it.price || 0) * (it.quantity || 0);
    count += it.quantity || 0;
    if (it.price_currency) currency = it.price_currency;
  }
  return { subtotal, count, currency };
}

// ─── Server sync (best-effort) ──────────────────────────────

export async function syncToSupabase(items: CartItem[]): Promise<void> {
  if (!isBrowser()) return;
  try {
    const session_id = getSessionId();
    if (!session_id) return;
    await fetch('/api/cart/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id, items }),
      keepalive: true,
    });
  } catch {
    // swallow — best-effort only
  }
}
