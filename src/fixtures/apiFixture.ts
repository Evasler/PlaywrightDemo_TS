import { test as base } from "@playwright/test";
import { ServiceHelper } from "../helpers/ServiceHelper";
import { RequestHelper } from "../helpers/RequestHelper";
import { TempDataHelper } from "../helpers/TempDataHelper";
import { StepSequenceHelper } from "../helpers/StepSequenceHelper";
import { ApiHelper } from "../helpers/ApiHelper";
import { ApiHelperObj } from "../customTypes/FixtureTypes";

export const apiTest = base.extend<ApiHelperObj, {}>({
    api: [ async ({ playwright, baseURL }, use) => {
        if (!baseURL)
            throw new Error("baseURL not defined in playwright.config.ts");
        const tempDataHelper = new TempDataHelper();
        const stepSequenceHelper = new StepSequenceHelper();
        const requestHelper = new RequestHelper(playwright.request, stepSequenceHelper, baseURL);
        const serviceHelper = new ServiceHelper(requestHelper, stepSequenceHelper, tempDataHelper, baseURL);
        const apiHelper = new ApiHelper(requestHelper, serviceHelper);
        await use(apiHelper);
    }, { scope: "test", box: true }]
});