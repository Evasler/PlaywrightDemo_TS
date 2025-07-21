import { test as base } from "@playwright/test";
import type { ErrorListenerOptionsObj, SetupStepsArgsObj, TeardownStepsArgsObj } from "../types/index.js";
import { browserHelper, extraStepsHelper, frameworkDataHelper, tabDataHelper, testDataHelper } from "../helpers/index.js";
import type { BaseSteps } from "../pages/index.js";
import { testUtils } from "../utils/index.js";

const extendedTest = base.extend<{ openNewTabInNewContext: <T extends BaseSteps>(page: T, authenticatedUser?: string) => T } & ErrorListenerOptionsObj & SetupStepsArgsObj & TeardownStepsArgsObj, object>({
    setupStepsArgsArray: [ undefined, { option: true }],
    teardownStepsArgsArray: [ undefined, { option: true }],
    errorListenerOptions: [ { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false }, { option: true }],
    openNewTabInNewContext: [ async ({ playwright, browser, baseURL, setupStepsArgsArray, teardownStepsArgsArray, errorListenerOptions }, use) => {
        
        await testUtils.verifyReportersAreReady();

        if (!baseURL)
            throw new Error("baseURL not defined in playwright.config.ts");
        tabDataHelper.resetPageTypes();
        testDataHelper.resetTestData();
        frameworkDataHelper.init({ 
            apiRequest: playwright.request, 
            baseUrl: baseURL, 
            browser: browser, 
            errorListenerOptions: errorListenerOptions
        });
        if (setupStepsArgsArray)
            await extraStepsHelper.execute("setupSteps", setupStepsArgsArray);
        await use((page, authenticatedUser) => {
            browserHelper.openNewTabInNewContext(authenticatedUser);
            return page;
        });
        if (teardownStepsArgsArray)
            await extraStepsHelper.execute("teardownSteps", teardownStepsArgsArray);
        await browserHelper.closeAllContexts();
    }, { scope: "test", box: true, auto: true }]
});

export default extendedTest;