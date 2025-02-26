import { test as base } from "@playwright/test";
import { ApiHelperObj, ErrorListenerOptionsObj, SharedStorageStateEndpointsObj, SharedStorageStateUser } from "../customTypes/CustomTypes";
import { ApiHelper } from "../helpers/ApiHelper";
import { RequestHelper } from "../helpers/RequestHelper";

export const test = base.extend<ApiHelperObj & SharedStorageStateEndpointsObj & SharedStorageStateUser, {}>({
    sharedStorageStateEndpoints: [ { authentication: "", validation: "" }, { option: true }],
    sharedStorageStateUser: [ "", { option: true }],
    apiHelper: [ async ({ playwright, baseURL, sharedStorageStateEndpoints, sharedStorageStateUser }, use) => {
        if (!baseURL)
            throw new Error("baseURL not defined in playwright.config.ts");
        const requestHelper = new RequestHelper(playwright.request, sharedStorageStateEndpoints);
        await requestHelper.openNewContext(sharedStorageStateUser);
        const apiHelper = new ApiHelper(requestHelper, baseURL);
        await use(apiHelper);
    }, { scope: "test" }]
});