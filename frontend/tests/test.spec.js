// tests/example.spec.js
import { expect, test } from '@playwright/test';

test('homepage has title', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page).toHaveTitle(/Hunger End - Delicious Food Delivered Fast/); // Update expected title
});

