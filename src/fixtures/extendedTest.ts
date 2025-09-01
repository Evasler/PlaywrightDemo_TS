/* eslint @typescript-eslint/no-invalid-void-type: 0 */

/**
 * @description This module extends Playwright's base test fixture with custom fixtures for
 * error handling, data preparation, browser context management, and test lifecycle hooks.
 * It provides a foundation for creating more maintainable and feature-rich tests.
 */

import {
  test as base,
  expect,
  type APIRequest,
  type Browser,
  type TestInfo,
} from "@playwright/test";
import type {
  ErrorListenerOptions,
  ExtraStepsArgs,
  FakerConfigArgs,
} from "../types/index.js";
import type { BaseSteps } from "../pages/index.js";
import {
  fileUtils,
  generalUtils,
  terminalUtils,
  testUtils,
} from "../utils/index.js";
import tabDataHelper from "../helpers/data/tabDataHelper.js";
import testDataHelper from "../helpers/data/testDataHelper.js";
import frameworkDataHelper from "../helpers/data/frameworkDataHelper.js";
import extraStepsHelper from "../helpers/data/extraStepsHelper.js";
import browserHelper from "../helpers/channel/browserHelper.js";
import stepSequenceHelper from "../helpers/chaining/stepSequenceHelper.js";
import { env } from "process";
import { interProcessCommunicationHelper } from "../helpers/data/interProcessCommunicationHelper.js";

/**
 * Extended test fixture that enhances Playwright's base test fixture with additional capabilities
 */
const extendedTest = base.extend<
  {
    /**
     * Configuration options for error listener behavior.
     * Controls whether tests fail on JavaScript errors, connection errors, or request errors.
     */
    errorListenerOptions: ErrorListenerOptions;

    /**
     * Configuration for the faker library used to generate test data
     */
    fakerConfigArgs: FakerConfigArgs;

    /**
     * Optional array of extra steps to execute during test setup
     */
    setupData?: ExtraStepsArgs[];

    /**
     * Optional array of extra steps to execute during test teardown
     */
    teardownData?: ExtraStepsArgs[];

    /**
     * Automatic fixture that handles test initialization, execution, and cleanup
     */
    autoFixture: void;

    /**
     * Opens a new browser tab in a new context
     * @param page - The page object representing the current page
     * @param authenticatedUser - Optional username for authentication in the new context
     * @returns The same page object for method chaining
     */
    openNewTabInNewContext: <T extends BaseSteps>(
      page: T,
      authenticatedUser?: string,
    ) => T;
  },
  object
>({
  errorListenerOptions: [
    {
      failOnJsError: false,
      failOnConnectionError: false,
      failOnRequestError: false,
    },
    { option: true },
  ],
  fakerConfigArgs: [{}, { option: true }],
  setupData: [undefined, { option: true }],
  teardownData: [undefined, { option: true }],

  /**
   * Automatic fixture that runs before and after each test
   * Handles:
   * - Verifying reporters have performed all necessary validations
   * - Skipping tests if trace files already exist
   * - Initializing test data
   * - Executing setup steps
   * - Executing teardown steps
   * - Closing all browser contexts
   */
  autoFixture: [
    async (
      {
        playwright,
        browser,
        baseURL,
        errorListenerOptions,
        fakerConfigArgs,
        setupData,
        teardownData,
      },
      use,
      testInfo,
    ) => {
      await verifyReporterValidationsFinished();
      skipRepeatIfTestPointTraceExists(testInfo);
      initTestData(
        baseURL,
        playwright.request,
        browser,
        errorListenerOptions,
        fakerConfigArgs,
      );
      if (setupData) await extraStepsHelper.execute("setup", setupData);
      terminalUtils.printColoredText(
        generalUtils.padCenteredString("TEST", 80),
        "blue",
      );

      await use();

      if (teardownData)
        await extraStepsHelper.execute("teardown", teardownData);
      await browserHelper.closeAllContexts();
    },
    { auto: true },
  ],

  /**
   * Fixture for opening a new tab in a new browser context and starting the step chain for a UI test
   */
  openNewTabInNewContext: [
    async ({}, use) => {
      await use((page, authenticatedUser) => {
        browserHelper.openNewTabInNewContext(authenticatedUser);
        return page;
      });
    },
    {},
  ],
});

export default extendedTest;

async function verifyReporterValidationsFinished() {
  await Promise.all([
    expect
      .poll(
        () => {
          interProcessCommunicationHelper.writeToServer("azure");
          return env.AZURE_VALIDATION;
        },
        { timeout: 30000 },
      )
      .toBe("ok"),
    expect
      .poll(
        () => {
          interProcessCommunicationHelper.writeToServer("excel");
          return env.EXCEL_VALIDATION;
        },
        { timeout: 30000 },
      )
      .toBe("ok"),
  ]).finally(() => {
    interProcessCommunicationHelper.closeConnection();
  });
}

/**
 * Skips test execution if a trace file already exists for the current test point.
 * This prevents redundant test executions, when using `--repeat-each=<n>` along with trace: `'retain-on-first-failure'`.
 *
 * @param testInfo - Playwright TestInfo object containing test metadata
 */
function skipRepeatIfTestPointTraceExists(testInfo: TestInfo) {
  const repeatMutedOutputDir = testInfo.outputDir.replace(
    new RegExp(`-repeat${testInfo.repeatEachIndex}$`),
    "",
  );
  testInfo.outputDir = repeatMutedOutputDir;
  const traceForTestPointExists = fileUtils.fileExists(
    `${repeatMutedOutputDir}/trace.zip`,
  );
  testInfo.skip(
    traceForTestPointExists,
    `Skipping test point, because trace file already exists: ${repeatMutedOutputDir}/trace.zip`,
  );
}

/**
 * Initializes test data and framework components for a test run
 *
 * @param baseUrl - Base URL for the application under test
 * @param apiRequest - Playwright APIRequest object for making API calls
 * @param browser - Playwright Browser instance
 * @param errorListenerOptions - Configuration for error handling behavior
 * @param fakerConfigArgs - Configuration for fake data generation
 * @throws Error if baseURL is not defined in the configuration
 */
function initTestData(
  baseUrl: string | undefined,
  apiRequest: APIRequest,
  browser: Browser,
  errorListenerOptions: ErrorListenerOptions,
  fakerConfigArgs: FakerConfigArgs,
) {
  if (!baseUrl) throw new Error("baseURL not defined in playwright.config.ts");
  tabDataHelper.resetComponentTypes();
  testDataHelper.resetTestData();
  stepSequenceHelper.resetStepSequence();
  frameworkDataHelper.init({
    apiRequest: apiRequest,
    baseUrl: baseUrl,
    browser: browser,
    errorListenerOptions: errorListenerOptions,
  });
  testUtils.fakerConfig(fakerConfigArgs);
}
