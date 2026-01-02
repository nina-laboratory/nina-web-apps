import { test, expect } from "@playwright/test";

test.describe("Retroactive Session Flow", () => {
    test("should allow logging for a past date", async ({ page }) => {
        // 1. Go to home page
        await page.goto("/");

        // 2. Click "Or log for another day"
        await page.click('text="Or log for another day"');

        // 3. Select a date (e.g., 2024-01-01)
        await page.fill('input[type="date"]', "2024-01-01");

        // 4. Click Go
        await page.click('text="Go"');

        // 5. Verify URL and Title
        await expect(page).toHaveURL(/\/session\/2024-01-01/);

        // The title format depends on locale, but checking for the date presence is good
        // "Monday, January 1, 2024" or close to it.
        await expect(page.locator("h1")).toContainText(/January 1, 2024|Jan 1, 2024/);
    });
});
