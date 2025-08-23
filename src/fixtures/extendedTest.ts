/* eslint @typescript-eslint/no-invalid-void-type: 0 */

import {
  test as base,
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

const extendedTest = base.extend<
  {
    errorListenerOptions: ErrorListenerOptions;
    fakerConfigArgs: FakerConfigArgs;
    setupData?: ExtraStepsArgs[];
    teardownData?: ExtraStepsArgs[];
    autoFixture: void;
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
      await testUtils.verifyReportersAreReady();
      skipRepeatIfTestTraceExists(testInfo);
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

function skipRepeatIfTestTraceExists(testInfo: TestInfo) {
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

function initTestData(
  baseUrl: string | undefined,
  apiRequest: APIRequest,
  browser: Browser,
  errorListenerOptions: ErrorListenerOptions,
  fakerConfigArgs: FakerConfigArgs,
) {
  if (!baseUrl) throw new Error("baseURL not defined in playwright.config.ts");
  tabDataHelper.resetComponents();
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
