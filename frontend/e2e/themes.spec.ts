import { test, expect } from '@playwright/test';

test.describe('Themes Page', () => {
  test('should display all stoic themes', async ({ page }) => {
    await page.goto('/themes');
    
    await page.waitForLoadState('networkidle');
    
    // Check for key themes
    await expect(page.getByText(/dichotomy of control/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/amor fati|negative visualization|memento mori/i)).toBeVisible();
  });

  test('should display scientific connections', async ({ page }) => {
    await page.goto('/themes');
    
    await page.waitForLoadState('networkidle');
    
    // Check for scientific connections
    const pageText = await page.textContent('body');
    const hasScientificContent = 
      pageText?.toLowerCase().includes('cbt') ||
      pageText?.toLowerCase().includes('neuroscience') ||
      pageText?.toLowerCase().includes('psychology') ||
      pageText?.toLowerCase().includes('research');
    
    expect(hasScientificContent).toBeTruthy();
  });
});
