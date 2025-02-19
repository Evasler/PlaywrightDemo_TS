import { test as base, Page } from "@playwright/test";
import { BrowserHelper } from "../helpers/BrowserHelper";
import { PageHelper } from "../helpers/PageHelper";
import { StepSequenceHelper } from "../helpers/StepSequenceHelper";

export type StorageStateOptions = {
    authenticationEndpoint: string;
    validationEndpoint: string;
    storageStateUser: string;
};
export type ErrorListenerOptions = {
    failOnJsError: boolean;
    failOnConnectionError: boolean;
    failOnRequestError: boolean;
}
type TestFixtures = {
    pageHelper: PageHelper;
};

export const test = base.extend<TestFixtures & StorageStateOptions & ErrorListenerOptions, {}>({
    authenticationEndpoint: [ "", { option: true }],
    validationEndpoint: [ "", { option: true }],
    storageStateUser: [ "", { option: true }],
    failOnJsError: [ false, { option: true }],
    failOnConnectionError: [ false, { option: true }],
    failOnRequestError: [ false, { option: true }],
    pageHelper: [ async ({ browser, storageStateUser, authenticationEndpoint, validationEndpoint, failOnJsError, failOnConnectionError, failOnRequestError }, use) => {
        const browserHelper = new BrowserHelper(browser, authenticationEndpoint, validationEndpoint, failOnJsError, failOnConnectionError, failOnRequestError);
        await browserHelper.openNewTabInNewContext(storageStateUser);
        const stepSequenceHelper = new StepSequenceHelper();
        const pageHelper = new PageHelper(browserHelper, stepSequenceHelper);
        await use(pageHelper);
        await browserHelper.closeAllContexts();
    }, { scope: "test" }]
});