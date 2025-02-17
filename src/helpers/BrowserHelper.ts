import { expect, Page } from "@playwright/test";
import { PageType } from "../customTypes/PageTypes";
import { TabPageTypeHelper } from "./TabPageTypeHelper";

export class BrowserHelper {

    private readonly tabPageTypeHelper: TabPageTypeHelper;

    constructor(private _workingTab: Page) {
        this.tabPageTypeHelper = new TabPageTypeHelper();
    }

    get workingBrowser() {
        return this.workingTab.context().browser()!;
    }

    get workingContext() {
        return this.workingTab.context();
    }
    
    get workingTab() {
        return this._workingTab;
    }

    get workingContextIndex() {
        return this.workingBrowser.contexts().indexOf(this.workingContext);
    }

    get workingTabIndex() {
        return this.workingContext.pages().indexOf(this.workingTab);
    }
    
    get lastContextIndex() {
        return this.workingBrowser.contexts().length - 1;
    }

    lastTabIndex(contextIndex: number) {
        return this.workingBrowser.contexts()[contextIndex].pages().length - 1;
    }

    updateWorkingTab(contextIndex: number, tabIndex: number) {
        this._workingTab = this.workingBrowser.contexts()[contextIndex].pages()[tabIndex];
    }
    
    async openNewTab(targetContext: "newContext" | "currentContext") {
        if (targetContext === "newContext") {
            const newContext = await this.workingBrowser.newContext();
            await newContext.newPage();
        } else if (targetContext === "currentContext") {
        await this.workingContext.newPage();
    }
    }

    async switchWorkingTab(contextIndex: number, tabIndex: number, expectedPageType: PageType) {
        expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThan(this.workingBrowser.contexts().length);
        expect(tabIndex, `Tab [${contextIndex},${tabIndex}] not found`).toBeLessThan(this.workingBrowser.contexts()[contextIndex].pages().length);
        const alreadyWorkingOnTheTab = contextIndex === this.workingContextIndex && tabIndex === this.workingTabIndex;
        expect(alreadyWorkingOnTheTab, `Already working on tab [${contextIndex},${tabIndex}]`).toBeFalsy();
        const actualPageType = this.tabPageTypeHelper.tabPageType(contextIndex, tabIndex);
        expect(actualPageType).toBe(expectedPageType);
        this.updateWorkingTab(contextIndex, tabIndex);
    }

    async closeContext(contextIndex: number) {
        expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThan(this.workingBrowser.contexts().length);
        expect(contextIndex, `Context [${contextIndex}] is the Working Context. It cannot be closed`).not.toEqual(this.workingContextIndex);
        this.workingBrowser.contexts()[contextIndex].pages().forEach(async (page) => await page.close());
        await expect(async () => expect(this.workingBrowser.contexts()[contextIndex].pages().length).toEqual(0)).toPass();
        await this.workingBrowser.contexts()[contextIndex].close();
        this.tabPageTypeHelper.removeContextPageTypes(contextIndex);
    }

    async closeTab(contextIndex: number, tabIndex: number) {
        expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThan(this.workingBrowser.contexts().length);
        expect(tabIndex, `Tab [${contextIndex},${tabIndex}] not found`).toBeLessThan(this.workingBrowser.contexts()[contextIndex].pages().length);
        const attemptingToCloseWorkingTab = contextIndex === this.workingContextIndex && tabIndex === this.workingTabIndex;
        expect(attemptingToCloseWorkingTab, `Tab [${contextIndex},${tabIndex}] is the Working Tab. It cannot be closed`).toBeFalsy();
        await this.workingBrowser.contexts()[contextIndex].pages()[tabIndex].close();
        this.tabPageTypeHelper.removeContextPageTypes(contextIndex);
    }

    async closeAllContexts() {
        this.workingBrowser.contexts().forEach(async context => {
            context.pages().forEach(async (page) => await page.close());
            await expect(async () => expect(context.pages().length).toEqual(0)).toPass();
            await context.close();
        });
        await expect(async () => expect(this.workingBrowser.contexts().length).toEqual(0)).toPass();
    }

    async closeBrowser() {
        await this.closeAllContexts();
        await this.workingBrowser.close();
    }
}