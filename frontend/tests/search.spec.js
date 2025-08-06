import { expect, test } from "@playwright/test";

test.describe("Search Results Page Functionality", () => {
    const baseURL = "http://localhost:5173"; // Change based on your frontend URL

    test.beforeEach(async ({ page }) => {
        // Assuming search query is "test"
        await page.goto(`${baseURL}/searchresult?query=test`);
    });

    test("should load the search results page successfully", async ({ page }) => {
        await expect(page.locator("h1")).toHaveText(/Search Results for "test"/i);
    });

    test("should show loading text initially", async ({ page }) => {
        await expect(page.locator("text=Loading...")).toBeVisible();
    });



    test("should show no results message when no items are found", async ({ page }) => {
        const mockData = [];

        // Mock API response for search results
        await page.route('**/api/v1/item/search?query=test', (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockData),
            });
        });

        await page.reload();

        await expect(page.locator('text=No items found for "test".')).toBeVisible();
    });


});
