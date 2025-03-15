import { test as base } from "@playwright/test";
import { BrowserHelper } from "../helpers/BrowserHelper";
import { PageHelper } from "../helpers/PageHelper";
import { TempDataHelperObj, ErrorListenerOptionsObj, PageHelperObj } from "../customTypes/FixtureTypes";
import { TempDataHelper } from "../helpers/TempDataHelper";

export const test = base.extend<PageHelperObj & ErrorListenerOptionsObj & TempDataHelperObj, {}>({
    errorListenerOptions: [ { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false }, { option: true }],
    tempDataHelper: [ async ({}, use) => {
        const tempDataHelper = new TempDataHelper();
        use(tempDataHelper);
    }, { scope: "test" }],
    pageHelper: [ async ({ browser, baseURL, errorListenerOptions, tempDataHelper }, use) => {
        if (!baseURL)
            throw new Error("baseURL not defined in playwright.config.ts");
        const browserHelper = new BrowserHelper(browser, baseURL, errorListenerOptions);
        const pageHelper = new PageHelper(browserHelper, tempDataHelper);
        await use(pageHelper);
        await browserHelper.closeAllContexts();
    }, { scope: "test" }]
});