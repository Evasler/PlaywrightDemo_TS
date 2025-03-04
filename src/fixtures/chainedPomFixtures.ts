import { test as base } from "@playwright/test";
import { BrowserHelper } from "../helpers/BrowserHelper";
import { PageHelper } from "../helpers/PageHelper";
import { ErrorListenerOptionsObj, PageHelperObj, SharedUser } from "../customTypes/CustomTypes";

export const test = base.extend<PageHelperObj & SharedUser & ErrorListenerOptionsObj, {}>({
    sharedUser: [ undefined, { option: true }],
    errorListenerOptions: [ { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false }, { option: true }],
    pageHelper: [ async ({ browser, baseURL, sharedUser, errorListenerOptions }, use) => {
        if (!baseURL)
            throw new Error("baseURL not defined in playwright.config.ts");
        const browserHelper = new BrowserHelper(browser, baseURL, errorListenerOptions);
        await browserHelper.openNewTabInNewContext(sharedUser);
        const pageHelper = new PageHelper(browserHelper);
        await use(pageHelper);
        await browserHelper.closeAllContexts();
    }, { scope: "test" }]
});