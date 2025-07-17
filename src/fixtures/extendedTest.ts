import { test as base } from "@playwright/test";
import { ErrorListenerOptionsObj, SetupStepsArgsObj, TeardownStepsArgsObj } from "../types/frameworkTypes";
import extraStepsHelper from "../helpers/extraStepsHelper";
import browserHelper from "../helpers/channel/browserHelper";
import frameworkDataHelper from "../helpers/data/frameworkDataHelper";
import tabDataHelper from "../helpers/data/tabDataHelper";
import testDataHelper from "../helpers/data/testDataHelper";
import BaseSteps from "../pages/base/baseSteps";

const extendedTest = base.extend<{ openNewTabInNewContext: <T extends BaseSteps>(page: T) => T } & ErrorListenerOptionsObj & SetupStepsArgsObj & TeardownStepsArgsObj, object>({
    setupStepsArgsArray: [ undefined, { option: true }],
    teardownStepsArgsArray: [ undefined, { option: true }],
    errorListenerOptions: [ { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false }, { option: true }],
    openNewTabInNewContext: [ async ({ playwright, browser, baseURL, setupStepsArgsArray, teardownStepsArgsArray, errorListenerOptions }, use) => {
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
        await use((page) => {
            browserHelper.openNewTabInNewContext();
            return page;
        });
        if (teardownStepsArgsArray)
            await extraStepsHelper.execute("teardownSteps", teardownStepsArgsArray);
        await browserHelper.closeAllContexts();
    }, { scope: "test", box: true, auto: true }]
});

export default extendedTest;