import { test, expect } from '@playwright/test';
import { captureConsoleErrors, assertNoConsoleErrors } from '../helpers';

test.describe('404 handling', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = captureConsoleErrors(page);
  });

  test('/parts/does-not-exist-uuid renders 404 gracefully', async ({ page }) => {
    const response = await page.goto('/parts/does-not-exist-uuid');
    expect(response).not.toBeNull();
    // Either a real 404 status or a soft 404 with friendly copy.
    const status = response!.status();
    expect([200, 404]).toContain(status);

    await expect(page.locator('body')).toBeVisible();
    const text = (await page.locator('body').textContent()) || '';
    expect(text).toMatch(/404|ne postoji|nije pronad|not found|ne postoji/i);

    await assertNoConsoleErrors(errors);
  });
});
