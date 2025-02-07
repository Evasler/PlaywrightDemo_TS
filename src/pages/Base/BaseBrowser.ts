import { expect } from "@playwright/test";
import { TestManager } from "../../managers/TestManager";
import { PageType } from "../../customTypes/PageTypes";

export abstract class BaseBrowser {

    constructor(protected readonly testManager: TestManager) { }

    protected get workingBrowser() {
        return this.workingTab.context().browser()!;
    }

    protected get workingContext() {
        return this.workingTab.context();
    }

    protected get workingTab() {
        return this.testManager.workingPage;
    }

    protected get workingContextIndex() {
        return this.workingBrowser.contexts().indexOf(this.workingContext);
    }

    protected get workingTabIndex() {
        return this.workingContext.pages().indexOf(this.workingTab);
    }

    protected updateWorkingTab(contextIndex: number, tabIndex: number) {
        this.testManager.updateWorkingPage(this.workingBrowser.contexts()[contextIndex].pages()[tabIndex]);
    }
    
    protected get lastContextIndex() {
        return this.workingBrowser.contexts().length - 1;
    }

    protected lastTabIndex(contextIndex: number) {
        return this.workingBrowser.contexts()[contextIndex].pages().length - 1;
    }
    
    protected async openNewTabBase(targetContext: "newContext" | "currentContext") {
        if (targetContext === "newContext") {
            const newContext = await this.workingBrowser.newContext();
            await newContext.newPage();
        } else if (targetContext === "currentContext") {
            await this.workingContext.newPage();
        }
    }

    protected async switchWorkingTabBase(contextIndex: number, tabIndex: number, expectedPageType: PageType) {
        expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThan(this.workingBrowser.contexts().length);
        expect(tabIndex, `Tab [${contextIndex},${tabIndex}] not found`).toBeLessThan(this.workingBrowser.contexts()[contextIndex].pages().length);
        const alreadyWorkingOnTheTab = contextIndex === this.workingContextIndex && tabIndex === this.workingTabIndex;
        expect(alreadyWorkingOnTheTab, `Already working on tab [${contextIndex},${tabIndex}]`).toBeFalsy();
        const actualPageType = this.testManager.tabPageType(contextIndex, tabIndex);
        expect(actualPageType).toBe(expectedPageType);
        this.updateWorkingTab(contextIndex, tabIndex);
    }

    protected async closeContextBase(contextIndex: number) {
        expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThan(this.workingBrowser.contexts().length);
        expect(contextIndex, `Context [${contextIndex}] is the Working Context. It cannot be closed`).not.toEqual(this.workingContextIndex);
        this.workingBrowser.contexts()[contextIndex].pages().forEach(async (page) => await page.close());
        await expect(async () => expect(this.workingBrowser.contexts()[contextIndex].pages().length).toEqual(0)).toPass();
        await this.workingBrowser.contexts()[contextIndex].close();
        this.testManager.removeContextPageTypes(contextIndex);
    }

    protected async closeTabBase(contextIndex: number, tabIndex: number) {
        expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThan(this.workingBrowser.contexts().length);
        expect(tabIndex, `Tab [${contextIndex},${tabIndex}] not found`).toBeLessThan(this.workingBrowser.contexts()[contextIndex].pages().length);
        const attemptingToCloseWorkingTab = contextIndex === this.workingContextIndex && tabIndex === this.workingTabIndex;
        expect(attemptingToCloseWorkingTab, `Tab [${contextIndex},${tabIndex}] is the Working Tab. It cannot be closed`).toBeFalsy();
        await this.workingBrowser.contexts()[contextIndex].pages()[tabIndex].close();
        this.testManager.removeContextPageTypes(contextIndex);
    }

    protected async closeBrowserBase() {
        this.workingBrowser.contexts().forEach(async context => {
            context.pages().forEach(async (page) => await page.close());
            await expect(async () => expect(context.pages().length).toEqual(0)).toPass();
            await context.close();
        });
        await expect(async () => expect(this.workingBrowser.contexts().length).toEqual(0)).toPass();
        await this.workingBrowser.close();
    }
}