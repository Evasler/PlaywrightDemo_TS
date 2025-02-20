import { test as base, Page } from "@playwright/test";
import { BrowserHelper } from "../helpers/BrowserHelper";
import { PageHelper } from "../helpers/PageHelper";
import { StepSequenceHelper } from "../helpers/StepSequenceHelper";
import { ErrorListenerOptionsObj, PageHelperObj, SharedStorageStateEndpointsObj, SharedStorageStateUser } from "../customTypes/CustomTypes";

export const test = base.extend<PageHelperObj & SharedStorageStateEndpointsObj & SharedStorageStateUser & ErrorListenerOptionsObj, {}>({
    sharedStorageStateEndpoints: [ { authentication: "", validation: "" }, { option: true }],
    sharedStorageStateUser: [ "", { option: true }],
    errorListenerOptions: [ { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false }, { option: true }],
    pageHelper: [ async ({ browser, sharedStorageStateEndpoints, sharedStorageStateUser, errorListenerOptions }, use) => {
        const browserHelper = new BrowserHelper(browser, sharedStorageStateEndpoints, errorListenerOptions);
        await browserHelper.openNewTabInNewContext(sharedStorageStateUser);
        const stepSequenceHelper = new StepSequenceHelper();
        const pageHelper = new PageHelper(browserHelper, stepSequenceHelper);
        await use(pageHelper);
        await browserHelper.closeAllContexts();
    }, { scope: "test" }]
});