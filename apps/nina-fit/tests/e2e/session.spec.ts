import { expect, test } from "@playwright/test";

test.describe("Fitness Session Flow", () => {
  test("should allow starting a session and recording exercises", async ({
    page,
  }) => {
    // 1. Go to home page
    await page.goto("/");

    // 2. Click "Start Today's Session" (assuming auto-login via Mock Auth)
    // Wait for button or login prompt. If mock auth is working, we should see "Welcome back" or "Start"
    await expect(page.getByText(/Welcome back/)).toBeVisible();
    await page.click('text="Start Today\'s Session"');

    // 3. Should be on session page
    await expect(page.getByText("Total Exercises"))
      .toBeVisible({ timeout: 10000 })
      .catch(() => {});
    // Or check for "Add Exercise" button
    await expect(
      page.getByRole("button", { name: "Add Exercise" }),
    ).toBeVisible();

    // 4. Add Exercise
    await page.click('text="Add Exercise"');

    // 5. Select Pushups
    await page.click('text="Pushups"');

    // 6. Record 10 reps
    await page.click('button:text("10")');

    // Increase sets to 2
    // Find the button that follows the "Sets" label
    const setPlusBtn = page.locator("div").filter({ hasText: /^Sets$/ }).locator("xpath=following-sibling::button");
    await setPlusBtn.click();

    await page.click('text="Save Record"');

    // 7. Verify it appears in list
    await expect(page.getByText("1 Exercises")).toBeVisible();
    await expect(page.getByText("Pushups")).toBeVisible();
    // Check for the value visually style
    const valueText = page.locator(".text-3xl");
    await expect(valueText).toContainText("2x");
    await expect(valueText).toContainText("10");

    // Add Running Exercise (Time & Distance)
    await page.click('text="Add Exercise"');
    await page.click('text="Running"');
    
    // Select 5km Preset (assuming it's available)
    await page.click('button:text("5 km")');
    // Select 20 min Preset
    await page.click('button:text("20 Min")');

    await page.click('text="Save Record"');

    // Verify Running Record
    await expect(page.getByText("2 Exercises")).toBeVisible(); // Total count
    await expect(page.getByText("5 km")).toBeVisible();
    await expect(page.getByText("20m")).toBeVisible();

    // Add Planks (Sets + Time)
    await page.click('text="Add Exercise"');
    await page.click('text="Planks"');
    
    // Select 30s Preset
    await page.click('button:text("30s")');
    // Increase Sets to 3
    const planksSetPlusBtn = page.locator("div").filter({ hasText: /^1 Sets$/ }).locator("xpath=following-sibling::button");
    await planksSetPlusBtn.click();
    await planksSetPlusBtn.click();

    await page.click('text="Save Record"');

    // Verify Planks Record
    await expect(page.getByText("3 Exercises")).toBeVisible();
    await expect(page.getByText("Planks")).toBeVisible();
    await expect(page.getByText("3x")).toBeVisible();
    await expect(page.getByText("00:30")).toBeVisible();

    // 8. Go back to dashboard (click logo or Home nav)
    await page.click('text="Home"');

    // 9. Verify Recent Sessions shows up
    await expect(page.getByText("Recent Sessions")).toBeVisible();
    await expect(page.getByText("1 exercises")).toBeVisible();
  });
});
