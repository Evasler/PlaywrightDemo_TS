import { PageType } from "../../customTypes/PageTypes";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BrowserHelper } from "../../helpers/BrowserHelper";
import test from "@playwright/test";
import { defaultTabPageType } from "../../helpers/TabPageTypeHelper";

export abstract class BasePage {

    constructor(private readonly pageType: PageType, private readonly browserHelper: BrowserHelper, private readonly stepSequenceHelper: StepSequenceHelper) { }

    protected addStep(title: string, callback: () => Promise<void>) {
        this.stepSequenceHelper.addStep(async() => {
            await test.step(title, callback);
        });
    }

    protected get workingTab() { return this.browserHelper.workingTab; }

    execute() {
        return this.stepSequenceHelper.stepSequence;
    }

    openNewTab_SS<T extends BasePage>(targetContext: "newContext" | "currentContext", page: T): T {
        this.addStep("openNewTab_SS", async() => {
            console.log("openNewTab_SS");
            await this.browserHelper.openNewTab(targetContext);
            const targetIsNewContext = targetContext === "newContext";
            const targetContextIndex = targetIsNewContext ? this.browserHelper.lastContextIndex : this.browserHelper.workingContextIndex;
            const newTabIndex = this.browserHelper.lastTabIndex(targetContextIndex);
            if (targetIsNewContext)
                this.browserHelper.tabPageTypeHelper.initializeContextPageTypes();
            this.browserHelper.tabPageTypeHelper.initializeTabPageType(targetContextIndex, newTabIndex);
            await this.browserHelper.switchWorkingTab(targetContextIndex, newTabIndex, defaultTabPageType);
        });
        return page;
    }

    switchWorkingTab_SS<T extends BasePage>(contextIndex: number, pageIndex: number, page: T): T {
        this.addStep("switchWorkingTab_SS", async() => {
            console.log("switchWorkingTab_SS");
            await this.browserHelper.switchWorkingTab(contextIndex, pageIndex, page.pageType);
        });
        return page;
    }

    async openNewTab<T extends BasePage>(targetContext: "newContext" | "currentContext", page: T): Promise<T> {
        return await test.step("openNewTab", async() => {
            await this.browserHelper.openNewTab(targetContext);
            const targetIsNewContext = targetContext === "newContext";
            const targetContextIndex = targetIsNewContext ? this.browserHelper.lastContextIndex : this.browserHelper.workingContextIndex;
            const newTabIndex = this.browserHelper.lastTabIndex(targetContextIndex);
            if (targetIsNewContext)
                this.browserHelper.tabPageTypeHelper.initializeContextPageTypes();
            this.browserHelper.tabPageTypeHelper.initializeTabPageType(targetContextIndex, newTabIndex);
            await this.browserHelper.switchWorkingTab(targetContextIndex, newTabIndex, defaultTabPageType);
            return page;
        });
    }
    
    async switchWorkingTab<T extends BasePage>(contextIndex: number, pageIndex: number, page: T): Promise<T> {
        return await test.step("switchWorkingTab", async() => {
            console.log("switchWorkingTabAsync")
            await this.browserHelper.switchWorkingTab(contextIndex, pageIndex, page.pageType);
            return page;
        });
    }
}