import { expect, test } from "@playwright/test";

test.describe("Terms & Conditions Page Functionality", () => {
    const baseURL = "http://localhost:5173"; // Change based on your frontend URL

    test.beforeEach(async ({ page }) => {
        await page.goto(`${baseURL}/terms-and-conditions`);
    });

    test("should load the Terms & Conditions page successfully", async ({ page }) => {
        await expect(page.locator("h1")).toHaveText(/Terms & Conditions/i);
    });

});
