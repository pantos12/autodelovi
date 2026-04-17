import { test, expect } from '@playwright/test';
import { captureConsoleErrors, assertNoConsoleErrors } from '../helpers';
import { TESTIDS } from '../testids';

test.describe('compare flow', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = captureConsoleErrors(page);
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');
  });

  test('add 2 parts to compare → /comparison shows both', async ({ page }) => {
    const toggles = page.getByTestId(TESTIDS.COMPARE_TOGGLE);
    await expect(toggles.first()).toBeVisible({ timeout: 15_000 });
    await toggles.nth(0).click();
    await toggles.nth(1).click();

    const compareBtn = page.getByRole('button', { name: /poredi|compare/i }).or(
      page.getByRole('link', { name: /poredi|compare/i })
    ).first();
    await expect(compareBtn).toBeVisible();
    await compareBtn.click();

    await page.waitForURL(/\/comparison/);
    const cards = page.getByTestId(TESTIDS.PART_CARD);
    expect(await cards.count()).toBeGreaterThanOrEqual(2);

    await assertNoConsoleErrors(errors);
  });
});
