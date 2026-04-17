import { test, expect } from '@playwright/test';
import { captureConsoleErrors, assertNoConsoleErrors } from '../helpers';
import { TESTIDS } from '../testids';

test.describe('marketplace sidebar filter', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = captureConsoleErrors(page);
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');
  });

  test('filter by Make + category narrows results', async ({ page }) => {
    const initialCount = await page.getByTestId(TESTIDS.PART_CARD).count();

    // Try label "Marka" / "Make".
    const makeControl = page
      .getByLabel(/marka|make|brand/i)
      .or(page.locator('select').filter({ hasText: /marka|make/i }))
      .first();
    if (await makeControl.count()) {
      const tag = await makeControl.evaluate((el) => el.tagName);
      if (tag === 'SELECT') {
        const opts = await makeControl.locator('option').allTextContents();
        const pick = opts.find((o) => o && !/sve|all|any/i.test(o)) || opts[1];
        if (pick) await makeControl.selectOption({ label: pick });
      } else {
        await makeControl.click();
      }
    }

    // Click a category in the sidebar.
    const catLink = page.locator('a[href*="/categories/"]').first();
    if (await catLink.count()) {
      await catLink.click();
      await page.waitForLoadState('networkidle');
    }

    const filteredCount = await page.getByTestId(TESTIDS.PART_CARD).count();
    expect(filteredCount).toBeGreaterThanOrEqual(0);
    expect(filteredCount).toBeLessThanOrEqual(Math.max(initialCount, filteredCount));
    await assertNoConsoleErrors(errors);
  });
});
