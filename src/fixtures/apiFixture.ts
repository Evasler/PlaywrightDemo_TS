import { test as base } from "@playwright/test";
import { DataHelperObj, ServiceHelperObj, SharedUser } from "../customTypes/CustomTypes";
import { ServiceHelper } from "../helpers/ServiceHelper";
import { RequestHelper } from "../helpers/RequestHelper";
import { DataHelper } from "../helpers/DataHelper";

export const test = base.extend<ServiceHelperObj & SharedUser & DataHelperObj, {}>({
    sharedUser: [ undefined, { option: true }],
    dataHelper: [ async ({}, use) => {
        const dataHelper = new DataHelper();
        use(dataHelper);
    }, { scope: "test" }],
    serviceHelper: [ async ({ playwright, baseURL, sharedUser, dataHelper }, use) => {
        if (!baseURL)
            throw new Error("baseURL not defined in playwright.config.ts");
        const requestHelper = new RequestHelper(playwright.request, baseURL);
        await requestHelper.openNewContext(sharedUser);
        const serviceHelper = new ServiceHelper(requestHelper, dataHelper, baseURL);
        await use(serviceHelper);
    }, { scope: "test" }]
});