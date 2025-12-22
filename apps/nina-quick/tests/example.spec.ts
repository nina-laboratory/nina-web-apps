import { expect, test } from "@playwright/test";

test("has title and components", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Nina Quick/); // Next.js metadata might default to Create Next App but let's see. Actually I should check h1
  await expect(page.getByRole("heading", { name: "Nina Quick" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Click me" })).toBeVisible();
});
