import { test as base } from "@playwright/test";
import { TestManager } from "../managers/TestManager";
import { PageManager } from "../managers/PageManager";

type TestFixtures = {
    pageManager: PageManager;
};

export const test = base.extend<TestFixtures, {}>({
    pageManager: [ async ({ page }, use) => {
        const testManager = new TestManager(page);
        const pageManager = new PageManager(testManager);
        await use(pageManager);
    }, { scope: "test" }]
});