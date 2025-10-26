import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('home page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000); // 5 seconds
    console.log(`Home page load time: ${loadTime}ms`);
  });

  test('API response time for random quote', async ({ page }) => {
    await page.goto('/');
    
    const startTime = Date.now();
    
    // Click new quote button and wait for response
    await page.getByRole('button', { name: /new quote/i }).click();
    await page.waitForLoadState('networkidle');
    
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(2000); // 2 seconds
    console.log(`Quote API response time: ${responseTime}ms`);
  });

  test('navigation between pages is responsive', async ({ page }) => {
    await page.goto('/');
    
    const pages = ['/philosophers', '/quotes', '/themes', '/timeline'];
    
    for (const pagePath of pages) {
      const startTime = Date.now();
      
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      const navTime = Date.now() - startTime;
      
      expect(navTime).toBeLessThan(3000); // 3 seconds
      console.log(`Navigation to ${pagePath}: ${navTime}ms`);
    }
  });
});
