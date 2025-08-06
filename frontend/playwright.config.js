// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: 'tests', // directory for test files
    timeout: 30000, // Test timeout (optional)
    use: {
        browserName: 'chromium', // Choose browser (chromium, firefox, webkit)
        headless: true, // Run tests headlessly
    },
});
