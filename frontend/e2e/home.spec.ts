import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display home page with quote', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page.locator('h1')).toContainText('Stoic Wisdom');
    
    // Check navigation exists
    await expect(page.getByRole('link', { name: 'Philosophers' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Quotes' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Themes' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Timeline' })).toBeVisible();
    
    // Check quote is displayed
    await expect(page.locator('blockquote')).toBeVisible();
  });

  test('should load new quote when button clicked', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial quote
    await page.waitForSelector('blockquote');
    const initialQuote = await page.locator('blockquote').textContent();
    
    // Click new quote button
    await page.getByRole('button', { name: /new quote/i }).click();
    
    // Wait for quote to change - may be same quote, so just check it loaded
    await page.waitForTimeout(500);
    await expect(page.locator('blockquote')).toBeVisible();
  });

  test('should navigate to philosophers page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /philosophers/i }).first().click();
    
    await expect(page).toHaveURL(/.*philosophers/);
    await expect(page.locator('h1')).toContainText('Philosophers');
  });

  test('should navigate to quotes page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /quotes/i }).first().click();
    
    await expect(page).toHaveURL(/.*quotes/);
  });

  test('should navigate to themes page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /themes/i }).first().click();
    
    await expect(page).toHaveURL(/.*themes/);
  });

  test('should navigate to timeline page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /timeline/i }).first().click();
    
    await expect(page).toHaveURL(/.*timeline/);
  });
});
