import { test as base } from "@playwright/test";
import { BrowserHelper } from "../helpers/BrowserHelper";
import { PageHelper } from "../helpers/PageHelper";
import { DataHelperObj, ErrorListenerOptionsObj, PageHelperObj, SharedUser } from "../customTypes/CustomTypes";
import { DataHelper } from "../helpers/DataHelper";

export const test = base.extend<PageHelperObj & SharedUser & ErrorListenerOptionsObj & DataHelperObj, {}>({
    sharedUser: [ undefined, { option: true }],
    errorListenerOptions: [ { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false }, { option: true }],
    dataHelper: [ async ({}, use) => {
        const dataHelper = new DataHelper();
        use(dataHelper);
    }, { scope: "test" }],
    pageHelper: [ async ({ browser, baseURL, sharedUser, errorListenerOptions, dataHelper }, use) => {
        if (!baseURL)
            throw new Error("baseURL not defined in playwright.config.ts");
        const browserHelper = new BrowserHelper(browser, baseURL, errorListenerOptions);
        await browserHelper.openNewTabInNewContext(sharedUser);
        const pageHelper = new PageHelper(browserHelper, dataHelper);
        await use(pageHelper);
        await browserHelper.closeAllContexts();
    }, { scope: "test" }]
});