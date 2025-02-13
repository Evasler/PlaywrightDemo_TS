import { test as base } from "@playwright/test";
import { BrowserHelper } from "../helpers/BrowserHelper";
import { PageHelper } from "../helpers/PageHelper";
import { StepSequenceHelper } from "../helpers/StepSequenceHelper";
import { TabPageTypeHelper } from "../helpers/TabPageTypeHelper";

type TestFixtures = {
    pageHelper: PageHelper;
};

export const test = base.extend<TestFixtures, {}>({
    pageHelper: [ async ({ page }, use) => {
        const tabPageTypeHelper = new TabPageTypeHelper();
        const browserHelper = new BrowserHelper(page, tabPageTypeHelper);
        const stepSequenceHelper = new StepSequenceHelper();
        const pageHelper = new PageHelper(browserHelper, stepSequenceHelper);
        await use(pageHelper);
    }, { scope: "test" }]
});