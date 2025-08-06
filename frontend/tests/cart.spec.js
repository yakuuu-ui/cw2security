import { expect, test } from "@playwright/test";

test.describe("Cart Page Functionality", () => {
    const baseURL = "http://localhost:5173"; // Change based on your frontend URL

    test.beforeEach(async ({ page }) => {
        await page.goto(`${baseURL}/cart`);
    });



    test("should allow increasing item quantity", async ({ page }) => {
        if (await page.locator("table tbody tr").count() > 0) {
            const initialQuantity = await page.locator("span.w-12").first().innerText();
            await page.click("button:text('+')");
            const updatedQuantity = await page.locator("span.w-12").first().innerText();
            expect(Number(updatedQuantity)).toBe(Number(initialQuantity) + 1);
        }
    });

    test("should allow decreasing item quantity", async ({ page }) => {
        if (await page.locator("table tbody tr").count() > 0) {
            const initialQuantity = await page.locator("span.w-12").first().innerText();
            if (Number(initialQuantity) > 1) {
                await page.click("button:text('-')");
                const updatedQuantity = await page.locator("span.w-12").first().innerText();
                expect(Number(updatedQuantity)).toBe(Number(initialQuantity) - 1);
            }
        }
    });

    test("should not allow quantity below 1", async ({ page }) => {
        if (await page.locator("table tbody tr").count() > 0) {
            await page.click("button:text('-')");
            const updatedQuantity = await page.locator("span.w-12").first().innerText();
            expect(Number(updatedQuantity)).toBeGreaterThanOrEqual(1);
        }
    });

    test("should remove item from cart", async ({ page }) => {
        if (await page.locator("table tbody tr").count() > 0) {
            const initialItems = await page.locator("table tbody tr").count();
            await page.click("button.bg-red-500"); // Click remove button
            await page.waitForTimeout(1000);
            const updatedItems = await page.locator("table tbody tr").count();
            expect(updatedItems).toBeLessThan(initialItems);
        }
    });

    test("should update total price when quantity changes", async ({ page }) => {
        if (await page.locator("table tbody tr").count() > 0) {
            const initialTotal = await page.locator("div.text-lg.font-bold span").last().innerText();
            await page.click("button:text('+')");
            await page.waitForTimeout(1000);
            const updatedTotal = await page.locator("div.text-lg.font-bold span").last().innerText();
            expect(Number(updatedTotal.replace("Rs ", ""))).toBeGreaterThan(Number(initialTotal.replace("Rs ", "")));
        }
    });

    test("should proceed to checkout and clear cart", async ({ page }) => {
        if (await page.locator("button:text('Proceed to Checkout')").isVisible()) {
            await page.click("button:text('Proceed to Checkout')");
            await page.waitForURL(/\/checkout/);
            expect(page.url()).toContain("/checkout");

            // Check if cart is cleared after proceeding
            await page.goto(`${baseURL}/cart`);
            await expect(page.locator("p:text('Your cart is empty.')")).toBeVisible();
        }
    });
});