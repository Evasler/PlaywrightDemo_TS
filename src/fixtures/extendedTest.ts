/**
 * @description This module extends Playwright's base test fixture with custom fixtures for
 * error handling, data preparation, browser context management, and test lifecycle hooks.
 * It provides a foundation for creating more maintainable and feature-rich tests.
 */

import { expect, type TestInfo } from "@playwright/test";
import type { ExtraStepsArgs, FakerConfigArgs } from "../types/index.js";
import type { BaseSteps } from "../pages/index.js";
import {
  fileUtils,
  generalUtils,
  terminalUtils,
  testUtils,
} from "../utils/index.js";
import extraStepsHelper from "../helpers/data/extraStepsHelper.js";
import { openAuthorizedContext } from "../helpers/auth/authenticationHelper.js";
import { env } from "process";
import { interProcessCommunicationHelper } from "../helpers/data/interProcessCommunicationHelper.js";
import {
  baseFixture,
  openNewTabInNewContext,
  type ErrorListenerOptions,
} from "playwrap";

/**
 * Extended test fixture that enhances Playwright's base test fixture with additional capabilities
 */
const extendedTest = baseFixture.extend<
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

    /* eslint @typescript-eslint/no-invalid-void-type: 0 */
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      { auto, fakerConfigArgs, setupData, teardownData },
      use,
      testInfo,
    ) => {
      await verifyReporterValidationsFinished();
      skipRepeatIfTestPointTraceExists(testInfo);
      testUtils.fakerConfig(fakerConfigArgs);
      if (setupData) await extraStepsHelper.execute("setup", setupData);
      terminalUtils.printColoredText(
        generalUtils.padCenteredString("TEST", 80),
        "blue",
      );

      await use();

      if (teardownData)
        await extraStepsHelper.execute("teardown", teardownData);
    },
    { auto: true },
  ],

  /**
   * Fixture for opening a new tab in a new browser context and starting the step chain for a UI test
   */
  openNewTabInNewContext: [
    async ({}, use) => {
      await use((page, authenticatedUser) => {
        openNewTabInNewContext(
          async () => await openAuthorizedContext(authenticatedUser),
        );
        return page;
      });
    },
    {},
  ],
});

export default extendedTest;

/**
 * Verifies that both Azure and Excel reporter validations have completed successfully.
 *
 * This function polls both Azure and Excel validation statuses simultaneously until they both
 * return "ok" or until the timeout period (30 seconds) is reached. The function uses
 * interprocess communication to check the current validation status. The connection to
 * the interprocess communication server will be closed in the end.
 *
 * @throws Will throw an error if either validation fails to return "ok" within the timeout period
 */
async function verifyReporterValidationsFinished() {
  await Promise.all([
    expect
      .poll(
        () => {
          interProcessCommunicationHelper.writeToServer(
            "azureValidationStatus",
          );
          return env.AZURE_VALIDATION;
        },
        { timeout: 30000 },
      )
      .toBe("ok"),
    expect
      .poll(
        () => {
          interProcessCommunicationHelper.writeToServer(
            "excelValidationStatus",
          );
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
