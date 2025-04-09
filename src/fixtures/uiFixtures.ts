import { test as base } from "@playwright/test";
import BrowserHelper from "../helpers/channel/BrowserHelper";
import PageStepsHelper from "../helpers/objectInstantiation/PageStepsHelper";
import { UiHelperObj, ErrorListenerOptionsObj } from "../customTypes/FrameworkTypes";
import TempDataHelper from "../helpers/chaining/TempDataHelper";
import StepSequenceHelper from "../helpers/chaining/StepSequenceHelper";
import UiHelper from "../helpers/testInitiation/UiHelper";
import { SetupStepsArgsObj, TeardownStepsArgsObj } from "../customTypes/FrameworkTypes";
import ExtraStepsHelper from "../helpers/ExtraStepsHelper";
import RequestHelper from "../helpers/channel/RequestHelper";
import ServiceStepsHelper from "../helpers/objectInstantiation/ServiceStepsHelper";

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
        const pageStepsHelper = new PageStepsHelper(browserHelper, stepSequenceHelper, tempDataHelper, baseURL);
        const uiHelper = new UiHelper(browserHelper, pageStepsHelper);
        const requestHelper = new RequestHelper(playwright.request, stepSequenceHelper, baseURL);
        const serviceStepsHelper = new ServiceStepsHelper(requestHelper, stepSequenceHelper, tempDataHelper, baseURL);
        const extraStepsHelper = new ExtraStepsHelper(requestHelper, serviceStepsHelper);
        if (setupStepsArgsArray)
            await extraStepsHelper.execute("setupSteps", setupStepsArgsArray);
        await use(uiHelper);
        if (teardownStepsArgsArray)
            await extraStepsHelper.execute("teardownSteps", teardownStepsArgsArray);
        await browserHelper.closeAllContexts();
    }, { scope: "test", box: true }]
});

export default uiTest;