import { expect, test } from '@playwright/test';


test('User sees error when passwords do not match', async ({ page }) => {
    // Step 1: Navigate to the registration page
    await page.goto('http://localhost:5173/register'); // Adjust URL as per your app's URL

    // Step 2: Fill in valid data but with mismatched passwords
    const fnameInput = await page.locator('input[placeholder="Enter first name"]');
    const lnameInput = await page.locator('input[placeholder="Enter last name"]');
    const phoneInput = await page.locator('input[placeholder="Enter phone number"]');
    const emailInput = await page.locator('input[placeholder="Enter email"]');
    const passwordInput = await page.locator('input[placeholder="Enter password"]');
    const confirmPasswordInput = await page.locator('input[placeholder="Confirm password"]');
    const termsCheckbox = await page.locator('input[type="checkbox"]');
    const submitButton = await page.locator('button[type="submit"]');

    // Fill in valid data with mismatched passwords
    await fnameInput.fill('Jane');
    await lnameInput.fill('Doe');
    await phoneInput.fill('1234567890');
    await emailInput.fill('janedoe@example.com');
    await passwordInput.fill('password123');
    await confirmPasswordInput.fill('password321'); // Passwords do not match
    await termsCheckbox.check(); // Agree to terms

    // Step 3: Submit the form
    await submitButton.click();

    // Step 4: Check for the password mismatch error
    const confirmPasswordError = page.locator('p.text-red-500');
    await expect(confirmPasswordError).toContainText('Passwords do not match.');
});

test('User sees error on invalid phone number format', async ({ page }) => {
    // Step 1: Navigate to the registration page
    await page.goto('http://localhost:5173/register'); // Adjust URL as per your app's URL

    // Step 2: Fill in valid data with an invalid phone number
    const fnameInput = await page.locator('input[placeholder="Enter first name"]');
    const lnameInput = await page.locator('input[placeholder="Enter last name"]');
    const phoneInput = await page.locator('input[placeholder="Enter phone number"]');
    const emailInput = await page.locator('input[placeholder="Enter email"]');
    const passwordInput = await page.locator('input[placeholder="Enter password"]');
    const confirmPasswordInput = await page.locator('input[placeholder="Confirm password"]');
    const termsCheckbox = await page.locator('input[type="checkbox"]');
    const submitButton = await page.locator('button[type="submit"]');

    // Fill in valid data with invalid phone number
    await fnameInput.fill('Mark');
    await lnameInput.fill('Smith');
    await phoneInput.fill('12345'); // Invalid phone number
    await emailInput.fill('marksmith@example.com');
    await passwordInput.fill('password123');
    await confirmPasswordInput.fill('password123');
    await termsCheckbox.check();

    // Step 3: Submit the form
    await submitButton.click();

    // Step 4: Check for the phone number error
    const phoneError = page.locator('p.text-red-500');
    await expect(phoneError).toContainText('Phone number must be 10 digits.');
});
