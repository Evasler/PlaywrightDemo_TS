import { test as base } from "@playwright/test";
import { ErrorListenerOptionsObj, SetupStepsArgsObj, TeardownStepsArgsObj } from "../customTypes/frameworkTypes";
import extraStepsHelper from "../helpers/extraStepsHelper";
import frameworkDataHelper from "../helpers/data/frameworkDataHelper";
import tabDataHelper from "../helpers/data/tabDataHelper";
import testDataHelper from "../helpers/data/testDataHelper";

const apiTest = base.extend<{ extraSteps: void } & ErrorListenerOptionsObj & SetupStepsArgsObj & TeardownStepsArgsObj, {}>({
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
    }, { scope: "test", box: true, auto: true }]
});

export default apiTest;