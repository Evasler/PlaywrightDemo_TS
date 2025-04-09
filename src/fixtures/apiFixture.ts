import { test as base } from "@playwright/test";
import ServiceStepsHelper from "../helpers/objectInstantiation/ServiceStepsHelper";
import RequestHelper from "../helpers/channel/RequestHelper";
import TempDataHelper from "../helpers/chaining/TempDataHelper";
import StepSequenceHelper from "../helpers/chaining/StepSequenceHelper";
import ApiHelper from "../helpers/testInitiation/ApiHelper";
import { ApiHelperObj } from "../customTypes/FrameworkTypes";
import ExtraStepsHelper from "../helpers/ExtraStepsHelper";
import { SetupStepsArgsObj, TeardownStepsArgsObj } from "../customTypes/FrameworkTypes";

const apiTest = base.extend<ApiHelperObj & SetupStepsArgsObj & TeardownStepsArgsObj, {}>({
    setupStepsArgsArray: [ undefined, { option: true }],
    teardownStepsArgsArray: [ undefined, { option: true }],
    api: [ async ({ playwright, baseURL, setupStepsArgsArray, teardownStepsArgsArray }, use) => {
        if (!baseURL)
            throw new Error("baseURL not defined in playwright.config.ts");
        const tempDataHelper = new TempDataHelper();
        const stepSequenceHelper = new StepSequenceHelper();
        const requestHelper = new RequestHelper(playwright.request, stepSequenceHelper, baseURL);
        const serviceStepsHelper = new ServiceStepsHelper(requestHelper, stepSequenceHelper, tempDataHelper, baseURL);
        const apiHelper = new ApiHelper(requestHelper, serviceStepsHelper);
        const extraStepsHelper = new ExtraStepsHelper(requestHelper, serviceStepsHelper);
        if (setupStepsArgsArray)
            await extraStepsHelper.execute("setupSteps", setupStepsArgsArray);
        await use(apiHelper);
        if (teardownStepsArgsArray)
            await extraStepsHelper.execute("teardownSteps", teardownStepsArgsArray);
    }, { scope: "test", box: true }]
});

export default apiTest;