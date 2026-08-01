import { test, expect } from '@playwright/test';


test.describe('Frame Handling', () => {

test('How to handle the Iframes', async ({ page }) => {

     // Navigate to the main Page

     await page.goto("https://demoqa.com/nestedframes");

     //verify the page title and url
     expect(page.url()).toContain("https://demoqa.com/nestedframes");
    
 
    // Switch to the first frame using frameLocator
     const frameOne = page.frameLocator('#frame1');
     const childFrame = frameOne.frameLocator('xpath=//iframe[@srcdoc="<p>Child Iframe</p>"]');
     expect(await childFrame.locator('p').textContent()).toBe('Child Iframe');

     const titleText =page.getByRole('heading', { name: 'Nested Frames' });
     expect(await titleText.isVisible()).toBe(true);
});



});