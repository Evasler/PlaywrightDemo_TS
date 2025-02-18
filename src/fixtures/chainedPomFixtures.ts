import { test as base, Page } from "@playwright/test";
import { BrowserHelper } from "../helpers/BrowserHelper";
import { PageHelper } from "../helpers/PageHelper";
import { StepSequenceHelper } from "../helpers/StepSequenceHelper";

export type StorageStateOptions = {
    authenticationEndpoint: string;
    validationEndpoint: string;
    storageStateUser: string;
};
type TestFixtures = {
    page: Page;
    pageHelper: PageHelper;
};

export const test = base.extend<TestFixtures & StorageStateOptions, {}>({
    authenticationEndpoint: [ "", { option: true }],
    validationEndpoint: [ "", { option: true }],
    storageStateUser: [ "", { option: true }],
    pageHelper: [ async ({ browser, storageStateUser, authenticationEndpoint, validationEndpoint }, use) => {
        const browserHelper = new BrowserHelper(browser, authenticationEndpoint, validationEndpoint);
        await browserHelper.openNewTabInNewContext(storageStateUser);
        const stepSequenceHelper = new StepSequenceHelper();
        const pageHelper = new PageHelper(browserHelper, stepSequenceHelper);
        await use(pageHelper);
        await browserHelper.closeAllContexts();
    }, { scope: "test" }]
});