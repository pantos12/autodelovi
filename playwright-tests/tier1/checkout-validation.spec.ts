import { test, expect } from '@playwright/test';
import { captureConsoleErrors, assertNoConsoleErrors } from '../helpers';

test.describe('checkout client-side validation', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = captureConsoleErrors(page);
    // Seed cart.
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');
    const addBtn = page.getByRole('button', { name: /dodaj u korpu|add to cart/i }).first();
    if (await addBtn.count()) await addBtn.click();
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
  });

  test('submit with missing name shows client-side error BEFORE /api/checkout/session', async ({ page }) => {
    const apiCalls: string[] = [];
    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('/api/checkout/session')) apiCalls.push(url);
    });

    const submit = page
      .getByRole('button', { name: /plati|checkout|nastavi|potvrdi/i })
      .first();
    await expect(submit).toBeVisible({ timeout: 10_000 });
    await submit.click();
    await page.waitForTimeout(1000);

    // Must NOT have hit the API yet.
    expect(apiCalls, 'checkout/session should not be called when name missing').toEqual([]);

    // Some form of error should be visible.
    const err = page.locator(
      'text=/obavezno|required|polje|unesite|greska|invalid|molimo/i'
    );
    await expect(err.first()).toBeVisible({ timeout: 5_000 });

    await assertNoConsoleErrors(errors);
  });
});
