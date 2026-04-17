import { test, expect } from '@playwright/test';
import { captureConsoleErrors, assertNoConsoleErrors } from '../helpers';
import { TESTIDS } from '../testids';

test.describe('category drill-down', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = captureConsoleErrors(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('click Filteri category → /categories/filteri with grid populated', async ({ page }) => {
    const filteri = page
      .locator('a[href*="/categories/filteri"]')
      .or(page.getByRole('link', { name: /filteri/i }))
      .first();
    await expect(filteri).toBeVisible({ timeout: 10_000 });
    await filteri.click();

    await page.waitForURL(/\/categories\/filteri/);
    await page.waitForLoadState('networkidle');

    const cards = page.getByTestId(TESTIDS.PART_CARD);
    expect(await cards.count()).toBeGreaterThan(0);
    await expect(page).toHaveURL(/\/categories\/filteri/);

    await assertNoConsoleErrors(errors);
  });
});
