import { test as base } from "@playwright/test";
import { BrowserManager } from "../managers/BrowserManager";
import { PageManager } from "../managers/PageManager";
import { StepSequenceManager } from "../managers/StepSequenceManager";
import { TabPageTypeHelper } from "../managers/TabPageTypeHelper";

type TestFixtures = {
    pageManager: PageManager;
};

export const test = base.extend<TestFixtures, {}>({
    pageManager: [ async ({ page }, use) => {
        const tabPageTypeHelper = new TabPageTypeHelper();
        const browserManager = new BrowserManager(page, tabPageTypeHelper);
        const stepSequenceManager = new StepSequenceManager();
        const pageManager = new PageManager(browserManager, stepSequenceManager);
        await use(pageManager);
    }, { scope: "test" }]
});