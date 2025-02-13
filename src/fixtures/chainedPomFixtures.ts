import { test as base } from "@playwright/test";
import { BrowserManager } from "../managers/BrowserManager";
import { PageManager } from "../managers/PageManager";
import { StepSequenceManager } from "../managers/StepSequenceManager";

type TestFixtures = {
    pageManager: PageManager;
};

export const test = base.extend<TestFixtures, {}>({
    pageManager: [ async ({ page }, use) => {
        const browserManager = new BrowserManager(page);
        const stepSequenceManager = new StepSequenceManager();
        const pageManager = new PageManager(browserManager, stepSequenceManager);
        await use(pageManager);
    }, { scope: "test" }]
});