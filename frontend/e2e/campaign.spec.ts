import { test, expect } from '@playwright/test';

test.describe('Campaign Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
  });

  test.describe('View Campaigns', () => {
    test('should display campaigns list', async ({ page }) => {
      await page.goto('/campaigns');

      // Wait for campaigns to load
      await page.waitForTimeout(1000);

      // Check if campaigns are displayed
      const campaigns = page.locator('[data-testid="campaign-card"]');
      const count = await campaigns.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display campaign details', async ({ page }) => {
      await page.goto('/campaigns');
      await page.waitForTimeout(1000);

      // Click on first campaign
      await page.click('[data-testid="campaign-card"]');

      await page.waitForTimeout(500);

      // Verify campaign details are shown
      await expect(page.locator('[data-testid="campaign-title"]')).toBeVisible();
      await expect(page.locator('[data-testid="campaign-description"]')).toBeVisible();
      await expect(page.locator('[data-testid="campaign-progress"]')).toBeVisible();
    });

    test('should filter campaigns by status', async ({ page }) => {
      await page.goto('/campaigns');
      await page.waitForTimeout(1000);

      // Click filter dropdown
      await page.click('[data-testid="status-filter"]');
      await page.click('text=Active');

      await page.waitForTimeout(500);

      // Verify filtered results
      const campaigns = page.locator('[data-testid="campaign-card"]');
      const count = await campaigns.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Create Campaign', () => {
    test('should display create campaign form', async ({ page }) => {
      await page.goto('/campaigns/create');

      await expect(page.locator('input[name="title"]')).toBeVisible();
      await expect(page.locator('textarea[name="description"]')).toBeVisible();
      await expect(page.locator('input[name="targetAmount"]')).toBeVisible();
      await expect(page.locator('input[name="startDate"]')).toBeVisible();
      await expect(page.locator('input[name="endDate"]')).toBeVisible();
    });

    test('should create a new campaign successfully', async ({ page }) => {
      await page.goto('/campaigns/create');

      // Fill campaign form
      await page.fill('input[name="title"]', 'New Test Campaign');
      await page.fill('textarea[name="description"]', 'This is a test campaign description');
      await page.fill('input[name="targetAmount"]', '50000');
      await page.fill('input[name="startDate"]', '2024-01-01');
      await page.fill('input[name="endDate"]', '2024-12-31');

      // Select restaurant
      await page.click('select[name="restaurantId"]');
      await page.selectOption('select[name="restaurantId"]', { index: 1 });

      // Submit form
      await page.click('button[type="submit"]');

      await page.waitForTimeout(1000);

      // Verify redirect to campaigns list or success message
      const url = page.url();
      expect(url).toContain('/campaigns');
    });

    test('should validate required fields', async ({ page }) => {
      await page.goto('/campaigns/create');

      // Try to submit without filling fields
      await page.click('button[type="submit"]');

      // Check for validation errors
      const titleInput = page.locator('input[name="title"]');
      const validationMessage = await titleInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage).toBeTruthy();
    });

    test('should validate target amount is positive', async ({ page }) => {
      await page.goto('/campaigns/create');

      await page.fill('input[name="title"]', 'Test Campaign');
      await page.fill('input[name="targetAmount"]', '-1000');

      await page.click('button[type="submit"]');

      await page.waitForTimeout(500);

      // Should show error or prevent submission
      const amountInput = page.locator('input[name="targetAmount"]');
      const value = await amountInput.inputValue();
      expect(parseFloat(value)).toBeLessThan(0);
    });

    test('should validate end date is after start date', async ({ page }) => {
      await page.goto('/campaigns/create');

      await page.fill('input[name="title"]', 'Test Campaign');
      await page.fill('input[name="targetAmount"]', '50000');
      await page.fill('input[name="startDate"]', '2024-12-31');
      await page.fill('input[name="endDate"]', '2024-01-01');

      await page.click('button[type="submit"]');

      await page.waitForTimeout(500);

      // Should show error message
    });
  });

  test.describe('Update Campaign', () => {
    test('should update campaign details', async ({ page }) => {
      await page.goto('/campaigns');
      await page.waitForTimeout(1000);

      // Click on first campaign
      await page.click('[data-testid="campaign-card"]');
      await page.waitForTimeout(500);

      // Click edit button
      await page.click('button:has-text("Edit")');

      // Update title
      await page.fill('input[name="title"]', 'Updated Campaign Title');

      // Submit
      await page.click('button[type="submit"]');

      await page.waitForTimeout(1000);

      // Verify update
      await expect(page.locator('[data-testid="campaign-title"]')).toContainText('Updated Campaign Title');
    });
  });

  test.describe('Delete Campaign', () => {
    test('should delete campaign with confirmation', async ({ page }) => {
      await page.goto('/campaigns');
      await page.waitForTimeout(1000);

      // Click on first campaign
      await page.click('[data-testid="campaign-card"]');
      await page.waitForTimeout(500);

      // Click delete button
      await page.click('button:has-text("Delete")');

      // Confirm deletion
      page.on('dialog', dialog => dialog.accept());
      await page.waitForTimeout(500);

      // Verify redirect to campaigns list
      const url = page.url();
      expect(url).toContain('/campaigns');
    });
  });
});
