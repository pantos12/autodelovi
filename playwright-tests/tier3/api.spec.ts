import { test, expect, APIRequestContext } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let api: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
  const bypass = process.env.VERCEL_PROTECTION_BYPASS;
  api = await playwright.request.newContext({
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    extraHTTPHeaders: bypass
      ? {
          'x-vercel-protection-bypass': bypass,
          'x-vercel-set-bypass-cookie': 'true',
        }
      : undefined,
  });
});

test.afterAll(async () => {
  await api.dispose();
});

test('GET /api/parts → 200 with data array', async () => {
  const res = await api.get('/api/parts');
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(Array.isArray(json.data ?? json)).toBe(true);
});

test('GET /api/parts?per_page=5 → 200 data.length ≤ 5', async () => {
  const res = await api.get('/api/parts?per_page=5');
  expect(res.status()).toBe(200);
  const json = await res.json();
  const arr = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
  expect(arr.length).toBeLessThanOrEqual(5);
});

test('GET /api/suppliers → 200', async () => {
  const res = await api.get('/api/suppliers');
  expect(res.status()).toBe(200);
});

test('GET /api/search?q=filter → 200', async () => {
  const res = await api.get('/api/search?q=filter');
  expect(res.status()).toBe(200);
});

test('GET /api/vin/INVALID → 400 or graceful 200 with error', async () => {
  const res = await api.get('/api/vin/INVALID');
  if (res.status() === 200) {
    const json = await res.json().catch(() => ({}));
    expect(json).toHaveProperty('error');
  } else {
    expect([400, 404, 422]).toContain(res.status());
  }
});

test('POST /api/checkout/session empty body → 400', async () => {
  const res = await api.post('/api/checkout/session', { data: {} });
  expect(res.status()).toBeGreaterThanOrEqual(400);
  expect(res.status()).toBeLessThan(500);
});

test('POST /api/checkout/session valid body → 200 with url', async () => {
  const res = await api.post('/api/checkout/session', {
    data: {
      customer: {
        name: 'Test Kupac',
        email: 'test@example.com',
        phone: '0601234567',
        address: 'Ulica 1',
      },
      items: [{ part_id: 'test-part', quantity: 1, price: 1000, name: 'Test' }],
    },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toHaveProperty('url');
});

test('POST /api/inquiries empty body → 400', async () => {
  const res = await api.post('/api/inquiries', { data: {} });
  expect(res.status()).toBeGreaterThanOrEqual(400);
  expect(res.status()).toBeLessThan(500);
});

test('POST /api/inquiries valid body → 200 ok+id', async () => {
  const res = await api.post('/api/inquiries', {
    data: {
      name: 'Test Kupac',
      email: 'test@example.com',
      phone: '0601234567',
      message: 'Zanima me dostupnost.',
      part_id: 'test-part',
    },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json.ok).toBe(true);
  expect(json).toHaveProperty('id');
});

test('POST /api/cart/sync valid body → 200 ok', async () => {
  const res = await api.post('/api/cart/sync', {
    data: {
      items: [{ part_id: 'test-part', quantity: 1 }],
    },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json.ok).toBe(true);
});
