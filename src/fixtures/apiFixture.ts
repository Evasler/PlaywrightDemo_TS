import { test as base } from "@playwright/test";
import { ServiceHelperObj, SharedUser } from "../customTypes/CustomTypes";
import { ServiceHelper } from "../helpers/ServiceHelper";
import { RequestHelper } from "../helpers/RequestHelper";

export const test = base.extend<ServiceHelperObj & SharedUser, {}>({
    sharedUser: [ undefined, { option: true }],
    serviceHelper: [ async ({ playwright, baseURL, sharedUser }, use) => {
        if (!baseURL)
            throw new Error("baseURL not defined in playwright.config.ts");
        const requestHelper = new RequestHelper(playwright.request, baseURL);
        await requestHelper.openNewContext(sharedUser);
        const serviceHelper = new ServiceHelper(requestHelper, baseURL);
        await use(serviceHelper);
    }, { scope: "test" }]
});