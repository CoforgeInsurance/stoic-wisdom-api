import { test, expect } from '@playwright/test';

test.describe('Philosophers Page', () => {
  test('should display all three philosophers', async ({ page }) => {
    await page.goto('/philosophers');
    
    // Check page title
    await expect(page.locator('h1')).toContainText('Philosophers');
    
    // Check all three philosophers are present
    await expect(page.getByText('Marcus Aurelius')).toBeVisible();
    await expect(page.getByText('Seneca')).toBeVisible();
    await expect(page.getByText('Epictetus')).toBeVisible();
  });

  test('should navigate to philosopher details', async ({ page }) => {
    await page.goto('/philosophers');
    
    // Click on Marcus Aurelius
    await page.getByRole('link', { name: /marcus aurelius/i }).first().click();
    
    // Check we're on the details page
    await expect(page).toHaveURL(/.*philosophers\/\d+/);
    await expect(page.locator('h1')).toContainText('Marcus Aurelius');
    
    // Check for biography section
    await expect(page.getByText(/biography|born|emperor/i)).toBeVisible();
  });

  test('should display philosopher quotes', async ({ page }) => {
    await page.goto('/philosophers');
    
    // Navigate to Marcus Aurelius
    await page.getByRole('link', { name: /marcus aurelius/i }).first().click();
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for quotes section
    await expect(page.getByText(/quotes|meditations/i)).toBeVisible();
  });
});
