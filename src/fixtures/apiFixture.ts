import { test as base } from "@playwright/test";
import { TempDataHelperObj, ServiceHelperObj, SharedUser } from "../customTypes/FixtureTypes";
import { ServiceHelper } from "../helpers/ServiceHelper";
import { RequestHelper } from "../helpers/RequestHelper";
import { TempDataHelper } from "../helpers/TempDataHelper";

export const test = base.extend<ServiceHelperObj & SharedUser & TempDataHelperObj, {}>({
    sharedUser: [ undefined, { option: true }],
    tempDataHelper: [ async ({}, use) => {
        const tempDataHelper = new TempDataHelper();
        use(tempDataHelper);
    }, { scope: "test" }],
    serviceHelper: [ async ({ playwright, baseURL, sharedUser, tempDataHelper }, use) => {
        if (!baseURL)
            throw new Error("baseURL not defined in playwright.config.ts");
        const requestHelper = new RequestHelper(playwright.request, baseURL);
        await requestHelper.openNewContext(sharedUser);
        const serviceHelper = new ServiceHelper(requestHelper, tempDataHelper, baseURL);
        await use(serviceHelper);
    }, { scope: "test" }]
});