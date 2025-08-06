import { expect, test } from "@playwright/test";

test.describe("My Orders Page Functionality", () => {
    const baseURL = "http://localhost:5173"; // Change based on your frontend URL

    test.beforeEach(async ({ page }) => {
        await page.goto(`${baseURL}/my-orders`);
    });



    test("should display 'My Profile' and 'My Orders' buttons in sidebar", async ({ page }) => {
        await expect(page.locator("button:text('My Profile')")).toBeVisible();
        await expect(page.locator("button:text('My Orders')")).toBeVisible();
    });

    test("should display orders if available", async ({ page }) => {
        await page.waitForTimeout(2000); // Wait for API response
        const orders = await page.locator(".border.rounded-lg.p-6").count();
        if (orders > 0) {
            expect(orders).toBeGreaterThan(0);
        } else {
            await expect(page.locator("p:text('No orders found.')")).toBeVisible();
        }
    });

    test("should display correct order status icon and color", async ({ page }) => {
        if (await page.locator(".border.rounded-lg.p-6").count() > 0) {
            const statusIcons = await page.locator(".text-yellow-500, .text-green-500, .text-red-500").count();
            expect(statusIcons).toBeGreaterThan(0);
        }
    });

    test("should correctly display item details inside table", async ({ page }) => {
        if (await page.locator(".border.rounded-lg.p-6").count() > 0) {
            await expect(page.locator("table")).toBeVisible();
            await expect(page.locator("th:text('Item Name')")).toBeVisible();
            await expect(page.locator("th:text('Quantity')")).toBeVisible();
            await expect(page.locator("th:text('Price')")).toBeVisible();
        }
    });


    test("should show loading message while fetching orders", async ({ page }) => {
        await expect(page.locator("p:text('Loading...')")).toBeVisible();
    });
});