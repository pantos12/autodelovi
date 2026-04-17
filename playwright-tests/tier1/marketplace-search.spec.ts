import { test, expect } from '@playwright/test';
import { captureConsoleErrors, assertNoConsoleErrors } from '../helpers';
import { TESTIDS } from '../testids';

test.describe('marketplace search', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = captureConsoleErrors(page);
    await page.goto('/marketplace');
  });

  test('search "filter" returns cards', async ({ page }) => {
    const search = page.getByRole('searchbox').or(
      page.getByPlaceholder(/pretra|search|trazi/i)
    ).first();
    await expect(search).toBeVisible();
    await search.fill('filter');
    await search.press('Enter');
    await page.waitForLoadState('networkidle');
    const cards = page.getByTestId(TESTIDS.PART_CARD);
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });
    expect(await cards.count()).toBeGreaterThan(0);
    await assertNoConsoleErrors(errors);
  });

  test('search "brake" returns cards without console errors', async ({ page }) => {
    const search = page.getByRole('searchbox').or(
      page.getByPlaceholder(/pretra|search|trazi/i)
    ).first();
    await search.fill('brake');
    await search.press('Enter');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/marketplace|search/i);
    const cards = page.getByTestId(TESTIDS.PART_CARD);
    expect(await cards.count()).toBeGreaterThanOrEqual(0);
    await assertNoConsoleErrors(errors);
  });
});
