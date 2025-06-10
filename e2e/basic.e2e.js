import { test } from '@playwright/test';

// Basic scenario: start game and open the losing chest

test('lose scenario', async ({ page }) => {
  // Force deterministic chest order so first chest is the losing one
  await page.addInitScript(() => { Math.random = () => 0; });

  await page.goto('./');
  await page.click('#start');
  await page.screenshot({ path: 'e2e/screenshots/start.png', fullPage: true });

  // Open the first chest which will contain "Lose"
  await page.locator('.chest-container').first().click({ force: true });
  await page.locator('.reward.lose').waitFor();
  await page.screenshot({ path: 'e2e/screenshots/lose.png', fullPage: true });
});
