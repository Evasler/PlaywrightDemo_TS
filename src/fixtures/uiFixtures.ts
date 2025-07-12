import { test as base } from "@playwright/test";
import { ErrorListenerOptionsObj } from "../customTypes/FrameworkTypes";
import { SetupStepsArgsObj, TeardownStepsArgsObj } from "../customTypes/FrameworkTypes";
import extraStepsHelper from "../helpers/ExtraStepsHelper";
import browserHelper from "../helpers/channel/BrowserHelper";
import frameworkDataHelper from "../helpers/data/FrameworkDataHelper";
import tabDataHelper from "../helpers/data/TabDataHelper";
import testDataHelper from "../helpers/data/TestDataHelper";

const uiTest = base.extend<{ extraSteps: void } & ErrorListenerOptionsObj & SetupStepsArgsObj & TeardownStepsArgsObj, {}>({
    setupStepsArgsArray: [ undefined, { option: true }],
    teardownStepsArgsArray: [ undefined, { option: true }],
    errorListenerOptions: [ { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false }, { option: true }],
    extraSteps: [ async ({ playwright, browser, baseURL, setupStepsArgsArray, teardownStepsArgsArray, errorListenerOptions }, use) => {
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
        await use();
        if (teardownStepsArgsArray)
            await extraStepsHelper.execute("teardownSteps", teardownStepsArgsArray);
        await browserHelper.closeAllContexts();
    }, { scope: "test", box: true, auto: true }]
});

export default uiTest;