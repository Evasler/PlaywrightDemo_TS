import { test as base } from "@playwright/test";
import { ApiHelperObj, SharedUser } from "../customTypes/CustomTypes";
import { ApiHelper } from "../helpers/ApiHelper";
import { RequestHelper } from "../helpers/RequestHelper";

export const test = base.extend<ApiHelperObj & SharedUser, {}>({
    sharedUser: [ undefined, { option: true }],
    apiHelper: [ async ({ playwright, baseURL, sharedUser }, use) => {
        if (!baseURL)
            throw new Error("baseURL not defined in playwright.config.ts");
        const requestHelper = new RequestHelper(playwright.request, baseURL);
        await requestHelper.openNewContext(sharedUser);
        const apiHelper = new ApiHelper(requestHelper, baseURL);
        await use(apiHelper);
    }, { scope: "test" }]
});