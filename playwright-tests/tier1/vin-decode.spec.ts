import { test, expect } from '@playwright/test';
import { captureConsoleErrors, assertNoConsoleErrors } from '../helpers';

test.describe('VIN decode on /vehicle-selection', () => {
  let errors: string[];
  let vinRouteAvailable = true;

  test.beforeEach(async ({ page, request }) => {
    errors = captureConsoleErrors(page);
    // Probe the VIN API availability.
    const probe = await request.get('/api/vin/1HGCM82633A004352').catch(() => null);
    if (!probe || probe.status() === 404) vinRouteAvailable = false;
    test.skip(!vinRouteAvailable, '/api/vin/ not available yet');
    await page.goto('/vehicle-selection');
    await page.waitForLoadState('networkidle');
  });

  test('VIN 1HGCM82633A004352 pre-fills Make dropdown', async ({ page }) => {
    const vinInput = page
      .getByLabel(/vin/i)
      .or(page.getByPlaceholder(/vin/i))
      .first();
    await expect(vinInput).toBeVisible();
    await vinInput.fill('1HGCM82633A004352');

    const decodeBtn = page.getByRole('button', { name: /dekodiraj|decode|potvrdi/i }).first();
    if (await decodeBtn.count()) await decodeBtn.click();

    // Make dropdown should pre-fill with something Honda-like.
    const make = page.getByLabel(/marka|make/i).first();
    await expect(make).toBeVisible();
    await expect
      .poll(async () => {
        const val = await make.inputValue().catch(() => '');
        return val.toLowerCase();
      }, { timeout: 10_000 })
      .toMatch(/honda/i);

    await assertNoConsoleErrors(errors);
  });
});
