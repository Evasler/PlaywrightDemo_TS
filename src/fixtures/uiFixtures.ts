import { test as base } from "@playwright/test";
import BrowserHelper from "../helpers/BrowserHelper";
import PageHelper from "../helpers/PageHelper";
import { UiHelperObj, ErrorListenerOptionsObj } from "../customTypes/FrameworkTypes";
import TempDataHelper from "../helpers/TempDataHelper";
import StepSequenceHelper from "../helpers/StepSequenceHelper";
import UiHelper from "../helpers/UiHelper";
import { SetupStepsArgsObj, TeardownStepsArgsObj } from "../customTypes/FrameworkTypes";
import ExtraStepsHelper from "../helpers/ExtraStepsHelper";
import RequestHelper from "../helpers/RequestHelper";
import ServiceHelper from "../helpers/ServiceHelper";

const uiTest = base.extend<UiHelperObj & ErrorListenerOptionsObj & SetupStepsArgsObj & TeardownStepsArgsObj, {}>({
    setupStepsArgsArray: [ undefined, { option: true }],
    teardownStepsArgsArray: [ undefined, { option: true }],
    errorListenerOptions: [ { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false }, { option: true }],
    ui: [ async ({ playwright, browser, baseURL, setupStepsArgsArray, teardownStepsArgsArray, errorListenerOptions }, use) => {
        if (!baseURL)
            throw new Error("baseURL not defined in playwright.config.ts");
        const tempDataHelper = new TempDataHelper();
        const stepSequenceHelper = new StepSequenceHelper();
        const browserHelper = new BrowserHelper(browser, stepSequenceHelper, baseURL, errorListenerOptions);
        const pageHelper = new PageHelper(browserHelper, stepSequenceHelper, tempDataHelper, baseURL);
        const uiHelper = new UiHelper(browserHelper, pageHelper);
        const requestHelper = new RequestHelper(playwright.request, stepSequenceHelper, baseURL);
        const serviceHelper = new ServiceHelper(requestHelper, stepSequenceHelper, tempDataHelper, baseURL);
        const extraStepsHelper = new ExtraStepsHelper(requestHelper, serviceHelper);
        if (setupStepsArgsArray)
            await extraStepsHelper.execute("setupSteps", setupStepsArgsArray);
        await use(uiHelper);
        if (teardownStepsArgsArray)
            await extraStepsHelper.execute("teardownSteps", teardownStepsArgsArray);
        await browserHelper.closeAllContexts();
    }, { scope: "test", box: true }]
});

export default uiTest;