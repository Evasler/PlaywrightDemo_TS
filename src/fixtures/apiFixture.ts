import { test as base } from "@playwright/test";
import { TempDataHelperObj, ServiceHelperObj } from "../customTypes/FixtureTypes";
import { ServiceHelper } from "../helpers/ServiceHelper";
import { RequestHelper } from "../helpers/RequestHelper";
import { TempDataHelper } from "../helpers/TempDataHelper";

export const test = base.extend<ServiceHelperObj & TempDataHelperObj, {}>({
    tempDataHelper: [ async ({}, use) => {
        const tempDataHelper = new TempDataHelper();
        use(tempDataHelper);
    }, { scope: "test" }],
    serviceHelper: [ async ({ playwright, baseURL, tempDataHelper }, use) => {
        if (!baseURL)
            throw new Error("baseURL not defined in playwright.config.ts");
        const requestHelper = new RequestHelper(playwright.request, baseURL);
        const serviceHelper = new ServiceHelper(requestHelper, tempDataHelper, baseURL);
        await use(serviceHelper);
    }, { scope: "test" }]
});