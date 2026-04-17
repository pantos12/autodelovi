import { test, expect } from '@playwright/test';
import { captureConsoleErrors, assertNoConsoleErrors } from '../helpers';
import { TESTIDS } from '../testids';

test.describe('inquiry modal for red-band cards', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = captureConsoleErrors(page);
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');
  });

  test('red-band Zatraži potvrdu → modal → POST /api/inquiries', async ({ page }) => {
    // Locate a card with a red band badge.
    const redBand = page.getByTestId(TESTIDS.BAND_BADGE).filter({
      hasText: /crven|red|🔴/i,
    }).first();
    await expect(redBand).toBeVisible({ timeout: 15_000 });

    const card = redBand.locator('xpath=ancestor::*[@data-testid="part-card"][1]');
    const inquiryBtn = card.getByRole('button', { name: /zatraži potvrdu|inquiry|upitaj/i });
    await expect(inquiryBtn).toBeVisible();
    await inquiryBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByLabel(/ime|name/i).first().fill('Test Upitač');
    await dialog.getByLabel(/email/i).first().fill('test@example.com');
    const msg = dialog.getByLabel(/poruka|message/i).first();
    if (await msg.count()) await msg.fill('Zanima me dostupnost.');

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/inquiries') && r.request().method() === 'POST'),
      dialog.getByRole('button', { name: /posalji|submit|zatrazi|send/i }).click(),
    ]);
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    await expect(page.locator('text=/uspesno|success|hvala|thanks/i')).toBeVisible({ timeout: 5_000 });

    await assertNoConsoleErrors(errors);
  });
});
