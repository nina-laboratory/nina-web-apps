import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { outputFolder: "./playwright-report" }]],
  use: {
    baseURL: "http://localhost:4002",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "MOCK_AUTH=true MOCK_DB=true bun run dev --port 4002",
    url: "http://localhost:4002",
    reuseExistingServer: !process.env.CI,
  },
});
