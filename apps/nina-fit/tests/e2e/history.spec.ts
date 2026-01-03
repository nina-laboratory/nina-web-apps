import { expect, test } from "@playwright/test";

test.describe("History Page", () => {
  test("should load history page and display sessions", async ({ page }) => {
    // 1. Go to history page
    await page.goto("/history");

    // 2. Check title
    await expect(page.getByText("Workout History")).toBeVisible();

    // 3. Since we use MOCK_AUTH, we should see content.
    // If no sessions, it shows "No sessions recorded yet".
    // If we ran the session test before, maybe there's data?
    // But tests usually run in isolated environments or mocked DBs?
    // Azure Table mock isn't reset between tests effectively unless we do it.
    // For now, just check that one of the states is visible.

    const noSessions = page.getByText("No sessions recorded yet");
    const sessionList = page.getByText("exercises performed");

    await expect(noSessions.or(sessionList).first()).toBeVisible();

    // 4. Check "Back to Home" button
    await page.click('text="Back to Home"');
    await expect(page).toHaveURL("/");
  });
});
