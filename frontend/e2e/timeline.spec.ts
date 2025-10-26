import { test, expect } from '@playwright/test';

test.describe('Timeline Page', () => {
  test('should display historical timeline', async ({ page }) => {
    await page.goto('/timeline');
    
    await page.waitForLoadState('networkidle');
    
    // Check for timeline content
    await expect(page.getByText(/timeline|history|stoic/i)).toBeVisible({ timeout: 10000 });
    
    // Look for historical dates/events
    const pageText = await page.textContent('body');
    const hasHistoricalContent = 
      pageText?.includes('BCE') ||
      pageText?.includes('CE') ||
      /\d{2,4}/.test(pageText || '');
    
    expect(hasHistoricalContent).toBeTruthy();
  });
});
