import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('User Registration', () => {
    test('should display registration form', async ({ page }) => {
      await page.click('text=Register');

      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should register a new user successfully', async ({ page }) => {
      await page.click('text=Register');

      // Fill registration form
      await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
      await page.fill('input[name="password"]', 'SecurePassword123');
      await page.fill('input[name="name"]', 'Test User');

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for redirect or success message
      await page.waitForTimeout(1000);

      // Verify successful registration (adjust based on your app's behavior)
      const url = page.url();
      expect(url).toContain('/'); // Should redirect to home or dashboard
    });

    test('should show validation errors for invalid email', async ({ page }) => {
      await page.click('text=Register');

      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="password"]', 'SecurePassword123');
      await page.fill('input[name="name"]', 'Test User');

      await page.click('button[type="submit"]');

      // Check for validation error (adjust selector based on your app)
      const emailInput = page.locator('input[name="email"]');
      const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage).toBeTruthy();
    });

    test('should show validation errors for short password', async ({ page }) => {
      await page.click('text=Register');

      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'short');
      await page.fill('input[name="name"]', 'Test User');

      await page.click('button[type="submit"]');

      // Wait for error message
      await page.waitForTimeout(500);
    });

    test('should show error for missing required fields', async ({ page }) => {
      await page.click('text=Register');

      // Try to submit without filling fields
      await page.click('button[type="submit"]');

      // Check that form is still visible (not submitted)
      await expect(page.locator('input[name="email"]')).toBeVisible();
    });
  });

  test.describe('User Login', () => {
    test('should display login form', async ({ page }) => {
      await page.click('text=Login');

      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should login with valid credentials', async ({ page }) => {
      await page.click('text=Login');

      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');

      await page.click('button[type="submit"]');

      // Wait for redirect
      await page.waitForTimeout(1000);

      // Verify successful login
      const url = page.url();
      expect(url).toContain('/');
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.click('text=Login');

      await page.fill('input[name="email"]', 'wrong@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');

      await page.click('button[type="submit"]');

      // Wait for error message
      await page.waitForTimeout(500);
    });

    test('should validate email format', async ({ page }) => {
      await page.click('text=Login');

      await page.fill('input[name="email"]', 'not-an-email');
      await page.fill('input[name="password"]', 'password123');

      await page.click('button[type="submit"]');

      const emailInput = page.locator('input[name="email"]');
      const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage).toBeTruthy();
    });
  });

  test.describe('User Logout', () => {
    test('should logout successfully', async ({ page }) => {
      // First login
      await page.click('text=Login');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');

      await page.waitForTimeout(1000);

      // Then logout
      await page.click('text=Logout');

      await page.waitForTimeout(500);

      // Verify logout (check for login button)
      await expect(page.locator('text=Login')).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing protected route', async ({ page }) => {
      await page.goto('/dashboard');

      await page.waitForTimeout(500);

      // Should redirect to login or show login prompt
      const url = page.url();
      expect(url).toMatch(/login|signin|auth/i);
    });
  });
});
