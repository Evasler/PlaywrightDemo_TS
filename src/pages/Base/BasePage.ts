import { PageType } from "../../customTypes/PageTypes";
import { StepSequenceManager } from "../../managers/StepSequenceManager";
import { BrowserManager } from "../../managers/BrowserManager";
import test from "@playwright/test";
import { defaultTabPageType } from "../../managers/TabPageTypeHelper";

export abstract class BasePage {

    constructor(private readonly pageType: PageType, private readonly browserManager: BrowserManager, private readonly stepSequenceManager: StepSequenceManager) { }

    protected addStep(title: string, callback: () => Promise<void>) {
        this.stepSequenceManager.addStep(async() => {
            await test.step(title, callback);
        });
    }

    protected get workingTab() { return this.browserManager.workingTab; }

    execute() {
        return this.stepSequenceManager.stepSequence;
    }

    openNewTab_SS<T extends BasePage>(targetContext: "newContext" | "currentContext", page: T): T {
        this.addStep("openNewTab_SS", async() => {
            console.log("openNewTab_SS");
            await this.browserManager.openNewTab(targetContext);
            const targetIsNewContext = targetContext === "newContext";
            const targetContextIndex = targetIsNewContext ? this.browserManager.lastContextIndex : this.browserManager.workingContextIndex;
            const newTabIndex = this.browserManager.lastTabIndex(targetContextIndex);
            if (targetIsNewContext)
                this.browserManager.tabPageTypeHelper.initializeContextPageTypes();
            this.browserManager.tabPageTypeHelper.initializeTabPageType(targetContextIndex, newTabIndex);
            await this.browserManager.switchWorkingTab(targetContextIndex, newTabIndex, defaultTabPageType);
        });
        return page;
    }

    switchWorkingTab_SS<T extends BasePage>(contextIndex: number, pageIndex: number, page: T): T {
        this.addStep("switchWorkingTab_SS", async() => {
            console.log("switchWorkingTab_SS");
            await this.browserManager.switchWorkingTab(contextIndex, pageIndex, page.pageType);
        });
        return page;
    }

    async openNewTab<T extends BasePage>(targetContext: "newContext" | "currentContext", page: T): Promise<T> {
        return await test.step("openNewTab", async() => {
            await this.browserManager.openNewTab(targetContext);
            const targetIsNewContext = targetContext === "newContext";
            const targetContextIndex = targetIsNewContext ? this.browserManager.lastContextIndex : this.browserManager.workingContextIndex;
            const newTabIndex = this.browserManager.lastTabIndex(targetContextIndex);
            if (targetIsNewContext)
                this.browserManager.tabPageTypeHelper.initializeContextPageTypes();
            this.browserManager.tabPageTypeHelper.initializeTabPageType(targetContextIndex, newTabIndex);
            await this.browserManager.switchWorkingTab(targetContextIndex, newTabIndex, defaultTabPageType);
            return page;
        });
    }
    
    async switchWorkingTab<T extends BasePage>(contextIndex: number, pageIndex: number, page: T): Promise<T> {
        return await test.step("switchWorkingTab", async() => {
            console.log("switchWorkingTabAsync")
            await this.browserManager.switchWorkingTab(contextIndex, pageIndex, page.pageType);
            return page;
        });
    }
}