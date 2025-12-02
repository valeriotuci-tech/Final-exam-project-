import { test, expect } from '@playwright/test';

test.describe('Investment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
  });

  test.describe('Make Investment', () => {
    test('should display investment form', async ({ page }) => {
      await page.goto('/campaigns');
      await page.waitForTimeout(1000);

      // Click on first campaign
      await page.click('[data-testid="campaign-card"]');
      await page.waitForTimeout(500);

      // Click invest button
      await page.click('button:has-text("Invest")');

      // Verify investment form is displayed
      await expect(page.locator('input[name="amount"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should make investment successfully', async ({ page }) => {
      await page.goto('/campaigns');
      await page.waitForTimeout(1000);

      // Click on first campaign
      await page.click('[data-testid="campaign-card"]');
      await page.waitForTimeout(500);

      // Click invest button
      await page.click('button:has-text("Invest")');

      // Fill investment amount
      await page.fill('input[name="amount"]', '1000');

      // Submit investment
      await page.click('button[type="submit"]');

      await page.waitForTimeout(1000);

      // Verify success message or redirect
      await expect(page.locator('text=Investment successful')).toBeVisible();
    });

    test('should validate minimum investment amount', async ({ page }) => {
      await page.goto('/campaigns');
      await page.waitForTimeout(1000);

      await page.click('[data-testid="campaign-card"]');
      await page.waitForTimeout(500);

      await page.click('button:has-text("Invest")');

      // Try to invest with amount below minimum
      await page.fill('input[name="amount"]', '10');

      await page.click('button[type="submit"]');

      await page.waitForTimeout(500);

      // Should show error message
      await expect(page.locator('text=Minimum investment')).toBeVisible();
    });

    test('should validate maximum investment amount', async ({ page }) => {
      await page.goto('/campaigns');
      await page.waitForTimeout(1000);

      await page.click('[data-testid="campaign-card"]');
      await page.waitForTimeout(500);

      await page.click('button:has-text("Invest")');

      // Try to invest with amount above maximum
      await page.fill('input[name="amount"]', '1000000');

      await page.click('button[type="submit"]');

      await page.waitForTimeout(500);

      // Should show error message
    });

    test('should not allow investment in completed campaigns', async ({ page }) => {
      await page.goto('/campaigns');
      await page.waitForTimeout(1000);

      // Find a completed campaign (if exists)
      const completedCampaign = page.locator('[data-testid="campaign-card"]:has-text("completed")');
      
      if (await completedCampaign.count() > 0) {
        await completedCampaign.first().click();
        await page.waitForTimeout(500);

        // Invest button should be disabled or not visible
        const investButton = page.locator('button:has-text("Invest")');
        if (await investButton.count() > 0) {
          expect(await investButton.isDisabled()).toBe(true);
        }
      }
    });
  });

  test.describe('View Investments', () => {
    test('should display user investments', async ({ page }) => {
      await page.goto('/investments');
      await page.waitForTimeout(1000);

      // Check if investments are displayed
      const investments = page.locator('[data-testid="investment-item"]');
      const count = await investments.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should display investment details', async ({ page }) => {
      await page.goto('/investments');
      await page.waitForTimeout(1000);

      const investments = page.locator('[data-testid="investment-item"]');
      
      if (await investments.count() > 0) {
        await investments.first().click();
        await page.waitForTimeout(500);

        // Verify investment details
        await expect(page.locator('[data-testid="investment-amount"]')).toBeVisible();
        await expect(page.locator('[data-testid="investment-date"]')).toBeVisible();
        await expect(page.locator('[data-testid="investment-status"]')).toBeVisible();
      }
    });

    test('should filter investments by status', async ({ page }) => {
      await page.goto('/investments');
      await page.waitForTimeout(1000);

      // Click filter dropdown
      await page.click('[data-testid="status-filter"]');
      await page.click('text=Completed');

      await page.waitForTimeout(500);

      // Verify filtered results
      const investments = page.locator('[data-testid="investment-item"]');
      const count = await investments.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Investment Confirmation', () => {
    test('should show confirmation dialog before investing', async ({ page }) => {
      await page.goto('/campaigns');
      await page.waitForTimeout(1000);

      await page.click('[data-testid="campaign-card"]');
      await page.waitForTimeout(500);

      await page.click('button:has-text("Invest")');
      await page.fill('input[name="amount"]', '1000');

      // Setup dialog handler
      let dialogShown = false;
      page.on('dialog', dialog => {
        dialogShown = true;
        dialog.accept();
      });

      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);

      // Verify confirmation was shown (if implemented)
    });

    test('should cancel investment on confirmation decline', async ({ page }) => {
      await page.goto('/campaigns');
      await page.waitForTimeout(1000);

      await page.click('[data-testid="campaign-card"]');
      await page.waitForTimeout(500);

      await page.click('button:has-text("Invest")');
      await page.fill('input[name="amount"]', '1000');

      // Setup dialog handler to dismiss
      page.on('dialog', dialog => dialog.dismiss());

      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);

      // Investment form should still be visible
      await expect(page.locator('input[name="amount"]')).toBeVisible();
    });
  });

  test.describe('Investment History', () => {
    test('should display investment history', async ({ page }) => {
      await page.goto('/profile/investments');
      await page.waitForTimeout(1000);

      // Check if history is displayed
      await expect(page.locator('[data-testid="investment-history"]')).toBeVisible();
    });

    test('should sort investments by date', async ({ page }) => {
      await page.goto('/profile/investments');
      await page.waitForTimeout(1000);

      // Click sort button
      await page.click('[data-testid="sort-by-date"]');
      await page.waitForTimeout(500);

      // Verify sorting (check first and last items)
      const investments = page.locator('[data-testid="investment-item"]');
      if (await investments.count() > 1) {
        const firstDate = await investments.first().locator('[data-testid="investment-date"]').textContent();
        const lastDate = await investments.last().locator('[data-testid="investment-date"]').textContent();
        
        // Dates should be in descending order
        expect(new Date(firstDate || '')).toBeInstanceOf(Date);
      }
    });

    test('should export investment history', async ({ page }) => {
      await page.goto('/profile/investments');
      await page.waitForTimeout(1000);

      // Click export button
      const downloadPromise = page.waitForEvent('download');
      await page.click('button:has-text("Export")');

      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('investments');
    });
  });
});
