import { test as base } from "@playwright/test";
import { TestManager } from "../managers/TestManager";
import { PageManager } from "../managers/PageManager";
import { StepSequenceManager } from "../managers/StepSequenceManager";

type TestFixtures = {
    pageManager: PageManager;
};

export const test = base.extend<TestFixtures, {}>({
    pageManager: [ async ({ page }, use) => {
        const testManager = new TestManager(page);
        const stepSequenceManager = new StepSequenceManager();
        const pageManager = new PageManager(testManager, stepSequenceManager);
        await use(pageManager);
    }, { scope: "test" }]
});