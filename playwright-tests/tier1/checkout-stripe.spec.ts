import { test, expect } from '@playwright/test';
import { captureConsoleErrors, assertNoConsoleErrors } from '../helpers';

test.describe('checkout → Stripe → return', () => {
  test.skip(
    process.env.STRIPE_TEST_MODE !== 'on',
    'Stripe test mode not enabled (set STRIPE_TEST_MODE=on to run).'
  );

  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = captureConsoleErrors(page);
    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');
    const addBtn = page.getByRole('button', { name: /dodaj u korpu|add to cart/i }).first();
    if (await addBtn.count()) await addBtn.click();
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
  });

  test('form → Stripe → back to /order/[id] with Plaćanje potvrđeno', async ({ page }) => {
    await page.getByLabel(/ime|name/i).first().fill('Test Kupac');
    await page.getByLabel(/email/i).first().fill('test@example.com');
    const phone = page.getByLabel(/telefon|phone/i).first();
    if (await phone.count()) await phone.fill('0601234567');
    const addr = page.getByLabel(/adresa|address/i).first();
    if (await addr.count()) await addr.fill('Ulica 1, 11000 Beograd');

    const submit = page
      .getByRole('button', { name: /plati|checkout|nastavi|potvrdi/i })
      .first();
    await submit.click();

    // Wait for Stripe Checkout.
    await page.waitForURL(/stripe\.com|checkout\.stripe/, { timeout: 30_000 });
    // Fill card in Stripe.
    const cardFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();
    await cardFrame.getByPlaceholder(/card number|broj kartice/i).fill('4242424242424242');
    await cardFrame.getByPlaceholder(/MM ?\/? ?YY/i).fill('12 / 34');
    await cardFrame.getByPlaceholder(/CVC/i).fill('123');

    await page.getByRole('button', { name: /pay|plati/i }).click();
    await page.waitForURL(/\/order\//, { timeout: 60_000 });

    await expect(page.locator('text=/plaćanje potvrđeno|payment confirmed/i')).toBeVisible();
    expect(page.url()).toMatch(/\/order\//);

    await assertNoConsoleErrors(errors);
  });
});
