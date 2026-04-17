import { test, expect } from '@playwright/test';
import { captureConsoleErrors, assertNoConsoleErrors } from '../helpers';
import { TESTIDS } from '../testids';

test.describe('add to cart', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = captureConsoleErrors(page);
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');
  });

  test('clicking Dodaj u korpu increments navbar cart badge', async ({ page }) => {
    const badge = page.getByTestId(TESTIDS.NAV_CART_COUNT);
    const initialText = (await badge.count()) ? (await badge.first().textContent()) || '0' : '0';
    const initial = parseInt(initialText.trim(), 10) || 0;

    // Find a card that is green or yellow band.
    const cards = page.getByTestId(TESTIDS.PART_CARD);
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });

    // Click the first "Dodaj u korpu" button we can find inside a card.
    const addBtn = page
      .getByRole('button', { name: /dodaj u korpu|add to cart/i })
      .first();
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Badge should update.
    await expect(badge.first()).toBeVisible({ timeout: 5_000 });
    await expect
      .poll(async () => {
        const txt = (await badge.first().textContent()) || '0';
        return parseInt(txt.trim(), 10) || 0;
      })
      .toBeGreaterThan(initial);

    await assertNoConsoleErrors(errors);
  });
});
