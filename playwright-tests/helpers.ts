import { Page, expect } from '@playwright/test';

/**
 * Attach a console error listener to a page. Call `expect(errors).toEqual([])`
 * at the end of a test to assert no console errors were emitted.
 */
export function captureConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore common noisy but benign errors.
      if (/favicon|Failed to load resource.*404/i.test(text)) return;
      errors.push(text);
    }
  });
  page.on('pageerror', (err) => {
    errors.push(`pageerror: ${err.message}`);
  });
  return errors;
}

export async function assertNoConsoleErrors(errors: string[]) {
  expect(errors, `console errors: ${JSON.stringify(errors, null, 2)}`).toEqual([]);
}
