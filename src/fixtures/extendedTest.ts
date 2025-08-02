/* eslint @typescript-eslint/no-invalid-void-type: 0 */
/* eslint @typescript-eslint/no-unused-vars: 0 */

import { test as base } from "@playwright/test";
import type {
  ErrorListenerOptionsObj,
  SetupStepsArgsObj,
  TeardownStepsArgsObj,
} from "../types/index.js";
import type { BaseSteps } from "../pages/index.js";
import { fileUtils, testUtils } from "../utils/index.js";
import tabDataHelper from "../helpers/data/tabDataHelper.js";
import testDataHelper from "../helpers/data/testDataHelper.js";
import frameworkDataHelper from "../helpers/data/frameworkDataHelper.js";
import extraStepsHelper from "../helpers/data/extraStepsHelper.js";
import browserHelper from "../helpers/channel/browserHelper.js";

const extendedTest = base.extend<
  { verifyReportersAreReady: void } & { skipRepeatIfTraceExists: void } & {
    initTestData: void;
  } & { performExtraSteps: void } & {
    openNewTabInNewContext: <T extends BaseSteps>(
      page: T,
      authenticatedUser?: string,
    ) => T;
  } & ErrorListenerOptionsObj &
    SetupStepsArgsObj &
    TeardownStepsArgsObj,
  object
>({
  setupStepsArgsArray: [undefined, { option: true }],
  teardownStepsArgsArray: [undefined, { option: true }],
  errorListenerOptions: [
    {
      failOnJsError: false,
      failOnConnectionError: false,
      failOnRequestError: false,
    },
    { option: true },
  ],

  verifyReportersAreReady: [
    async ({}, use) => {
      await testUtils.verifyReportersAreReady();
      await use();
    },
    { box: true },
  ],

  skipRepeatIfTraceExists: [
    async ({ verifyReportersAreReady }, use, testInfo) => {
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
      await use();
    },
    { box: true },
  ],

  initTestData: [
    async (
      {
        skipRepeatIfTraceExists,
        playwright,
        browser,
        baseURL,
        errorListenerOptions,
      },
      use,
    ) => {
      if (!baseURL)
        throw new Error("baseURL not defined in playwright.config.ts");
      tabDataHelper.resetPageTypes();
      testDataHelper.resetTestData();
      frameworkDataHelper.init({
        apiRequest: playwright.request,
        baseUrl: baseURL,
        browser: browser,
        errorListenerOptions: errorListenerOptions,
      });
      await use();
    },
    { box: true },
  ],

  performExtraSteps: [
    async (
      { initTestData, setupStepsArgsArray, teardownStepsArgsArray },
      use,
    ) => {
      if (setupStepsArgsArray)
        await extraStepsHelper.execute("setupSteps", setupStepsArgsArray);
      await use();
      if (teardownStepsArgsArray)
        await extraStepsHelper.execute("teardownSteps", teardownStepsArgsArray);
      await browserHelper.closeAllContexts();
    },
    { box: true, auto: true },
  ],

  openNewTabInNewContext: [
    async ({}, use) => {
      await use((page, authenticatedUser) => {
        browserHelper.openNewTabInNewContext(authenticatedUser);
        return page;
      });
    },
    { box: true },
  ],
});

export default extendedTest;
