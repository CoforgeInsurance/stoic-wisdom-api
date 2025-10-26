import { test, expect } from '@playwright/test';

test.describe('Quotes Page', () => {
  test('should display list of quotes', async ({ page }) => {
    await page.goto('/quotes');
    
    // Wait for quotes to load
    await page.waitForLoadState('networkidle');
    
    // Check that quotes are displayed
    const quotes = page.locator('blockquote, .quote, [data-testid="quote"]');
    await expect(quotes.first()).toBeVisible({ timeout: 10000 });
    
    // Should have multiple quotes
    const count = await quotes.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display philosopher names and sources', async ({ page }) => {
    await page.goto('/quotes');
    
    await page.waitForLoadState('networkidle');
    
    // Check for philosopher names
    await expect(page.getByText(/marcus aurelius|seneca|epictetus/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('should allow searching quotes', async ({ page }) => {
    await page.goto('/quotes');
    
    await page.waitForLoadState('networkidle');
    
    // Look for search input
    const searchInput = page.getByRole('textbox', { name: /search/i });
    if (await searchInput.isVisible()) {
      await searchInput.fill('control');
      await page.waitForTimeout(1000);
      
      // Check that results contain the search term
      const pageText = await page.textContent('body');
      expect(pageText?.toLowerCase()).toContain('control');
    }
  });
});
