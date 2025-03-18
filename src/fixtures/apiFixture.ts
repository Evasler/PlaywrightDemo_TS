import { test as base } from "@playwright/test";
import { ServiceHelper } from "../helpers/ServiceHelper";
import { RequestHelper } from "../helpers/RequestHelper";
import { TempDataHelper } from "../helpers/TempDataHelper";
import { StepSequenceHelper } from "../helpers/StepSequenceHelper";
import { ApiHelper } from "../helpers/ApiHelper";
import { ApiHelperObj } from "../customTypes/FrameworkTypes";
import { ExtraStepsHelper } from "../helpers/ExtraStepsHelper";
import { SetupStepsArgsObj, TeardownStepsArgsObj } from "../customTypes/FrameworkTypes";

export const apiTest = base.extend<ApiHelperObj & SetupStepsArgsObj & TeardownStepsArgsObj, {}>({
    setupStepsArgsArray: [ undefined, { option: true }],
    teardownStepsArgsArray: [ undefined, { option: true }],
    api: [ async ({ playwright, baseURL, setupStepsArgsArray, teardownStepsArgsArray }, use) => {
        if (!baseURL)
            throw new Error("baseURL not defined in playwright.config.ts");
        const tempDataHelper = new TempDataHelper();
        const stepSequenceHelper = new StepSequenceHelper();
        const requestHelper = new RequestHelper(playwright.request, stepSequenceHelper, baseURL);
        const serviceHelper = new ServiceHelper(requestHelper, stepSequenceHelper, tempDataHelper, baseURL);
        const apiHelper = new ApiHelper(requestHelper, serviceHelper);
        const extraStepsHelper = new ExtraStepsHelper(requestHelper, serviceHelper);
        if (setupStepsArgsArray)
            await extraStepsHelper.execute("setupSteps", setupStepsArgsArray);
        await use(apiHelper);
        if (teardownStepsArgsArray)
            await extraStepsHelper.execute("teardownSteps", teardownStepsArgsArray);
    }, { scope: "test", box: true }]
});