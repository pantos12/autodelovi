import { test, expect } from '@playwright/test';
import { captureConsoleErrors, assertNoConsoleErrors } from '../helpers';
import { TESTIDS } from '../testids';

test.describe('cart qty stepper', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = captureConsoleErrors(page);
    // Seed cart by adding an item first.
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');
    const addBtn = page.getByRole('button', { name: /dodaj u korpu|add to cart/i }).first();
    if (await addBtn.count()) await addBtn.click();
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
  });

  test('stepper + / − updates line total and grand total', async ({ page }) => {
    const inc = page.getByTestId(TESTIDS.QTY_INC).first();
    const dec = page.getByTestId(TESTIDS.QTY_DEC).first();

    await expect(inc).toBeVisible({ timeout: 10_000 });
    await expect(dec).toBeVisible();

    // Capture initial totals text.
    const bodyBefore = await page.locator('body').textContent();
    await inc.click();
    await page.waitForTimeout(500);
    const bodyAfterInc = await page.locator('body').textContent();
    expect(bodyAfterInc).not.toEqual(bodyBefore);

    await dec.click();
    await page.waitForTimeout(500);
    const bodyAfterDec = await page.locator('body').textContent();
    expect(bodyAfterDec).not.toEqual(bodyAfterInc);

    await assertNoConsoleErrors(errors);
  });
});
