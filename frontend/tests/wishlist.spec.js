import { expect, test } from '@playwright/test';



test('Displays empty wishlist message when no items are available', async ({ page }) => {
    // Mock the API response to simulate an empty wishlist
    await page.route('**/api/v1/wishlist/customer/*', (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                wishlist: []
            })
        });
    });

    // Navigate to the Wishlist page
    await page.goto('http://localhost:5173/wishlist');

    // Wait for the "Your wishlist is empty" message to appear
    const emptyMessage = await page.locator('p.text-center');
    await expect(emptyMessage).toContainText('Your wishlist is empty.');
});



