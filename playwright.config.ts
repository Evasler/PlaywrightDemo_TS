import { defineConfig, devices } from '@playwright/test';
import type { ErrorListenerOptionsObj } from './src/types/index.js';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

process.env.reporterStatusFilepath = "./resources/other/reportersStatus.json";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<ErrorListenerOptionsObj>({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'], 
    ['./src/reporters/GlobalReporter.ts'],
    ['./src/reporters/ExcelReporter.ts', 
      { 
        enabled: false,
        mandatoryReporting: false,
        filepath: "./excel-report/PlaywrightDemo_TS.xlsx",
        configurationNames: [ "configuration1", "configuration2" ]
      }
    ],
    ['./src/reporters/AzureReporter.ts',
      {
        enabled: false,
        mandatoryReporting: false,
        azureBaseUrl: "https://dev.azure.com/",
        organizationName: "",
        projectName: "",
        personalAccessToken: "",
        runName: "PlaywrightDemo_TS Run",
        planId: 0,
        suiteIds: [ 0 ],
        configurationNames: [ "" ]
      }
    ]
    //'./src/reporters/ExecOrderReporter.ts'
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    baseURL: "https://automationintesting.online/",
    errorListenerOptions: {
      failOnJsError: true,
      failOnConnectionError: true,
      failOnRequestError: true
    },
    headless: false
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'basicTests',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /tests\/lab\/(dataHandling|stepChaining|storageState)\/*\/.*\.spec\.ts/
    },
    {
      name: 'failingTests',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /tests\/lab\/listeners\/*\/.*\.spec\.ts/
    },
    {
      name: 'executionOrderDependency',
      testMatch: /executionOrder\/dependencies\/global.setup.ts/,
      teardown: 'executionOrderTeardown'
    },
    {
      name: 'executionOrderTeardown',
      testMatch: /executionOrder\/dependencies\/global.teardown.ts/
    },
    {
      name: 'executionOrder',
      testMatch: /executionOrder\/core\/.*/,
      dependencies: ['executionOrderDependency']
    },
    {
      name: 'excel-configuration1',
      testMatch: /excelReporting\/.*/,
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'excel-configuration2',
      testMatch: /excelReporting\/.*/,
      use: {
        ...devices['Desktop Chrome']
      }
    }
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
