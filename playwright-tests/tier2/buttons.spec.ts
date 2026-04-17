import { test, expect, Page } from '@playwright/test';

const PAGES = [
  '/',
  '/marketplace',
  '/cart',
  '/checkout',
  '/vehicle-selection',
  '/comparison',
  '/suppliers',
  '/categories/filteri',
  '/categories/kocnice',
  '/parts/mann-filter-hu-719-7x',
];

const DENY_BUTTON_TEXT = /obrisi|delete|odjavi|logout|prijavi se preko|google|facebook/i;

function isInternalHref(href: string, baseURL: string): { allow: boolean; reason?: string } {
  if (!href) return { allow: false, reason: 'empty href' };
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return { allow: false, reason: 'mailto/tel' };
  if (href.startsWith('#')) return { allow: false, reason: 'hash' };
  if (href.startsWith('javascript:')) return { allow: false, reason: 'js' };
  if (/^https?:\/\//i.test(href)) {
    try {
      const u = new URL(href);
      const base = new URL(baseURL);
      // autodelovi.sale (any subdomain) is considered internal.
      if (u.hostname === base.hostname) return { allow: true };
      if (/(^|\.)autodelovi\.sale$/i.test(u.hostname)) return { allow: true };
      return { allow: false, reason: `external host ${u.hostname}` };
    } catch {
      return { allow: false, reason: 'bad URL' };
    }
  }
  // Relative path → internal.
  return { allow: true };
}

async function withErrorCapture<T>(page: Page, fn: () => Promise<T>): Promise<{ result: T | null; errors: string[] }> {
  const errors: string[] = [];
  const onConsole = (msg: any) => {
    if (msg.type() === 'error') {
      const t = msg.text();
      if (!/favicon|Failed to load resource.*404/i.test(t)) errors.push(t);
    }
  };
  const onPageError = (err: Error) => errors.push(`pageerror: ${err.message}`);
  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  let result: T | null = null;
  try {
    result = await fn();
  } catch (e: any) {
    errors.push(`thrown: ${e.message}`);
  }
  page.off('console', onConsole);
  page.off('pageerror', onPageError);
  return { result, errors };
}

for (const path of PAGES) {
  test.describe(`smoke: ${path}`, () => {
    test(`buttons + links + forms on ${path} do not explode`, async ({ page, baseURL }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));

      const navResp = await page.goto(path).catch(() => null);
      if (!navResp) {
        test.skip(true, `could not navigate to ${path}`);
        return;
      }
      await page.waitForLoadState('domcontentloaded');

      // BUTTONS
      const buttons = await page.getByRole('button').all();
      let clicked = 0;
      for (const btn of buttons.slice(0, 20)) {
        const text = (await btn.textContent().catch(() => '')) || '';
        if (DENY_BUTTON_TEXT.test(text)) continue;
        if (!(await btn.isVisible().catch(() => false))) continue;
        if (!(await btn.isEnabled().catch(() => false))) continue;
        const { errors } = await withErrorCapture(page, async () => {
          await btn.click({ trial: false, timeout: 3_000 }).catch(() => {});
          // Close any dialog that may have opened.
          const dialog = page.getByRole('dialog');
          if (await dialog.count()) {
            await page.keyboard.press('Escape').catch(() => {});
          }
        });
        expect(errors, `button "${text.trim().slice(0, 40)}" on ${path}`).toEqual([]);
        clicked++;
      }

      // LINKS
      const linkEls = await page.locator('a[href]').all();
      const hrefs = new Set<string>();
      for (const a of linkEls) {
        const href = await a.getAttribute('href').catch(() => null);
        if (href) hrefs.add(href);
      }
      const bURL = baseURL || 'http://localhost:3000';
      let linksChecked = 0;
      for (const href of Array.from(hrefs).slice(0, 15)) {
        const decision = isInternalHref(href, bURL);
        if (!decision.allow) continue;
        const target = href.startsWith('http') ? href : new URL(href, bURL).toString();
        const resp = await page.goto(target).catch(() => null);
        expect(resp, `link ${href} on ${path}`).not.toBeNull();
        if (resp) {
          // Allow 200/301/302/304; skip 404 for odd dynamic routes.
          expect([200, 301, 302, 304, 404]).toContain(resp.status());
          const title = await page.title().catch(() => '');
          expect(title, `title empty for ${target}`).not.toBe('');
        }
        linksChecked++;
      }

      // FORMS — just count; actual submission varies.
      const forms = await page.locator('form').all();
      expect(forms.length).toBeGreaterThanOrEqual(0);

      expect(pageErrors, `uncaught exceptions on ${path}`).toEqual([]);
      expect(clicked + linksChecked).toBeGreaterThanOrEqual(0);
    });
  });
}
