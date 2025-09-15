import { defineConfig, devices } from "@playwright/test";
import type { ErrorListenerOptions } from "./src/types/index.js";
import dotenv from "dotenv";
import { interProcessCommunicationHelper } from "./src/helpers/data/interProcessCommunicationHelper.js";

dotenv.config({ path: ".env", quiet: true });
if (!process.env.GREP)
  throw new Error(
    "Please set GREP in .env file to define the scope of tests to run",
  );

await interProcessCommunicationHelper.setup();

export default defineConfig<{ errorListenerOptions: ErrorListenerOptions }>({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.RETRIES ? +process.env.RETRIES : 0,
  workers: process.env.WORKERS ? +process.env.WORKERS : 1,
  reportSlowTests: null,
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
  expect: { timeout: 10000 },
  use: {
    trace: "retain-on-first-failure",
    baseURL: "https://automationintesting.online/",
    errorListenerOptions: {
      failOnJsError: true,
      failOnConnectionError: true,
      failOnRequestError: true,
    },
    headless: process.env.HEADLESS === "true",
    viewport: { width: 1920, height: 1080 },
    contextOptions: {
      reducedMotion: "reduce",
      serviceWorkers: "block",
    },
  },

  projects: [
    {
      name: "chromium-prod",
      use: { ...devices["Desktop Chrome"] },
      grep: new RegExp(process.env.GREP),
      testIgnore: process.env.TEST_IGNORE
        ? new RegExp(process.env.TEST_IGNORE)
        : undefined,
    },
    {
      name: "firefox-prod",
      use: { ...devices["Desktop Firefox"] },
      grep: new RegExp(process.env.GREP),
      testIgnore: process.env.TEST_IGNORE
        ? new RegExp(process.env.TEST_IGNORE)
        : undefined,
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
  ],
});
