import { test, expect } from '@playwright/test';
import { captureConsoleErrors, assertNoConsoleErrors } from '../helpers';

test.describe('home page', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = captureConsoleErrors(page);
    await page.goto('/');
  });

  test('renders hero, search, category cards, footer', async ({ page }) => {
    // Hero / landing content
    await expect(page.locator('main, body')).toBeVisible();
    // Some kind of search input on home.
    const search = page.getByRole('searchbox').or(
      page.getByPlaceholder(/pretra|search|trazi/i)
    );
    await expect(search.first()).toBeVisible();
    // Category cards — look for a link or card referencing a category slug.
    const catLink = page.locator('a[href*="/categories/"]').first();
    await expect(catLink).toBeVisible();
    // Footer
    await expect(page.locator('footer')).toBeVisible();
    await assertNoConsoleErrors(errors);
  });
});
