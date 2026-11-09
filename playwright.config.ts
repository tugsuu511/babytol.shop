import { defineConfig, devices } from "@playwright/test";

// E2E тест production build дээр ажиллана (Next.js-ийн зөвлөмж).
// `npm run test:e2e` нь build хийгээд `next start`-ыг өөрөө асаана.
const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;
const CI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 2 : undefined,
  reporter: CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    locale: "mn-MN",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
    // Хөтчийн бүрэн матриц: `npx playwright install firefox webkit` хийгээд доорхыг нээнэ
    // { name: "desktop-firefox", use: { ...devices["Desktop Firefox"] } },
    // { name: "mobile-safari", use: { ...devices["iPhone 15"] } },
  ],
  // E2E_BASE_URL өгвөл (жишээ нь preview deploy) локал сервер асаахгүй
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run start -- -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: !CI,
        timeout: 120_000,
        stdout: "pipe",
      },
});
