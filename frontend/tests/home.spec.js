import { expect, test } from '@playwright/test';

test('Home page displays items correctly', async ({ page }) => {
    // Step 1: Mock the API response to simulate data fetching
    await page.route('**/api/v1/item/items-by-tags', (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                Featured: [
                    { id: '1', name: 'Featured Item 1', image: 'featured1.jpg', price: 10 },
                    { id: '2', name: 'Featured Item 2', image: 'featured2.jpg', price: 15 }
                ],
                Trending: [
                    { id: '3', name: 'Trending Item 1', image: 'trending1.jpg', price: 12 },
                    { id: '4', name: 'Trending Item 2', image: 'trending2.jpg', price: 18 }
                ],
                Popular: [
                    { id: '5', name: 'Best Seller Item 1', image: 'bestseller1.jpg', price: 20 },
                    { id: '6', name: 'Best Seller Item 2', image: 'bestseller2.jpg', price: 25 }
                ],
                Special: [
                    { id: '7', name: 'Hunger End Special 1', image: 'special1.jpg', price: 30 },
                    { id: '8', name: 'Hunger End Special 2', image: 'special2.jpg', price: 35 }
                ]
            })
        });
    });

    // Step 2: Navigate to the Home page
    await page.goto('http://localhost:5173/');  // Update with the correct URL for your app

    // Step 3: Wait for the page to load
    await page.waitForSelector('h2'); // Wait for section titles (Featured Items, Trending Items, etc.) to be visible

    // Step 4: Verify that the sections are rendered correctly
    const featuredSection = await page.locator('h2:has-text("Featured Items")');
    const trendingSection = await page.locator('h2:has-text("Trending Items")');
    const bestSellerSection = await page.locator('h2:has-text("Best Seller Items")');
    const specialSection = await page.locator('h2:has-text("Hunger End Special")');

    // Step 5: Check that the sections are visible
    await expect(featuredSection).toBeVisible();
    await expect(trendingSection).toBeVisible();
    await expect(bestSellerSection).toBeVisible();
    await expect(specialSection).toBeVisible();

    // Step 6: Verify that the correct number of items are displayed in each section
    const featuredItems = await page.locator('section:has(h2:has-text("Featured Items")) .grid > div');
    const trendingItems = await page.locator('section:has(h2:has-text("Trending Items")) .grid > div');
    const bestSellerItems = await page.locator('section:has(h2:has-text("Best Seller Items")) .grid > div');
    const specialItems = await page.locator('section:has(h2:has-text("Hunger End Special")) .grid > div');

    // Step 7: Verify that the correct number of items are rendered in each section
    await expect(featuredItems).toHaveCount(2);  // 2 items in Featured
    await expect(trendingItems).toHaveCount(2);  // 2 items in Trending
    await expect(bestSellerItems).toHaveCount(2);  // 2 items in Best Seller
    await expect(specialItems).toHaveCount(2);  // 2 items in Special

    // Step 8: Optionally check that the data in each item card matches
    const firstFeaturedItem = await page.locator('section:has(h2:has-text("Featured Items")) .grid > div:nth-child(1)');
    await expect(firstFeaturedItem).toContainText('Featured Item 1');
    await expect(firstFeaturedItem).toContainText('10'); // Price check

    const firstTrendingItem = await page.locator('section:has(h2:has-text("Trending Items")) .grid > div:nth-child(1)');
    await expect(firstTrendingItem).toContainText('Trending Item 1');
    await expect(firstTrendingItem).toContainText('12'); // Price check
});


