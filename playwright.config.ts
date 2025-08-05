import { defineConfig, devices } from "@playwright/test";
import type { ErrorListenerOptions } from "./src/types/index.js";
import dotenv from "dotenv";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

dotenv.config({ path: ".env", quiet: true });
process.env.REPORTER_STATUS_FILEPATH = "./resources/other/reportersStatus.json";

if (!process.env.GREP)
  throw new Error(
    "Please set GREP in .env file to define the scope of tests to run",
  );

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<{ errorListenerOptions: ErrorListenerOptions }>({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.RETRIES ? +process.env.RETRIES : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.WORKERS ? +process.env.WORKERS : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"],
    ["./src/reporters/GlobalReporter.ts"],
    [
      "./src/reporters/ExcelReporter.ts",
      {
        enabled: process.env.EXCEL_REPORTER_ENABLED === "true",
        mandatoryReporting: process.env.EXCEL_REPORTER_MANDATORY === "true",
        filepath: "./excel-report/PlaywrightDemo_TS.xlsx",
        configurationNames: ["chromium-prod", "firefox-prod"],
      },
    ],
    [
      "./src/reporters/AzureReporter.ts",
      {
        enabled: process.env.AZURE_REPORTER_ENABLED === "true",
        mandatoryReporting: process.env.AZURE_REPORTER_MANDATORY === "true",
        azureBaseUrl: "https://dev.azure.com/",
        organizationName: "",
        projectName: "",
        personalAccessToken: "",
        runName: "PlaywrightDemo_TS Run",
        planId: 0,
        suiteIds: [0],
        configurationNames: [""],
      },
    ],
    //'./src/reporters/ExecOrderReporter.ts'
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-first-failure",
    baseURL: "https://automationintesting.online/",
    errorListenerOptions: {
      failOnJsError: true,
      failOnConnectionError: true,
      failOnRequestError: true,
    },
    headless: process.env.HEADLESS === "true",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium-prod",
      use: { ...devices["Desktop Chrome"] },
      grep: new RegExp(process.env.GREP),
    },
    {
      name: "firefox-prod",
      use: { ...devices["Desktop Firefox"] },
      grep: new RegExp(process.env.GREP),
    },
    {
      name: "executionOrder",
      testMatch: /tests\/executionOrder\/core\/.*\.spec\.ts/,
      dependencies: ["executionOrderDependency"],
    },
    {
      name: "executionOrderDependency",
      testMatch: /tests\/executionOrder\/dependencies\/global\.setup\.ts/,
      teardown: "executionOrderTeardown",
    },
    {
      name: "executionOrderTeardown",
      testMatch: /tests\/executionOrder\/dependencies\/global\.teardown\.ts/,
    },
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
