import { PageType } from "../../customTypes/PageTypes";
import { defaultTabPageType } from "../../managers/TestManager";
import { TestManager } from "../../managers/TestManager";
import { BaseBrowser } from "./BaseBrowser";
import test from "@playwright/test";

export abstract class BasePage extends BaseBrowser {

    constructor(private readonly pageType: PageType, testManager: TestManager) {
        super(testManager);
    }

    protected addStep(title: string, callback: () => Promise<void>) {
        this.testManager.addStep(async() => {
            await test.step(title, callback);
        });
    }

    execute() {
        return this.testManager.stepSequence;
    }

    openNewTab_SS<T extends BasePage>(targetContext: "newContext" | "currentContext", page: T): T {
        this.addStep("openNewTab_SS", async() => {
            console.log("openNewTab_SS");
            await this.openNewTabBase(targetContext);
            const targetIsNewContext = targetContext === "newContext";
            const targetContextIndex = targetIsNewContext ? this.lastContextIndex : this.workingContextIndex;
            const newTabIndex = this.lastTabIndex(targetContextIndex);
            if (targetIsNewContext)
                this.testManager.initializeContextPageTypes();
            this.testManager.initializeTabPageType(targetContextIndex, newTabIndex);
            await this.switchWorkingTabBase(targetContextIndex, newTabIndex, defaultTabPageType);
        });
        return page;
    }

    switchWorkingTab_SS<T extends BasePage>(contextIndex: number, pageIndex: number, page: T): T {
        this.addStep("switchWorkingTab_SS", async() => {
            console.log("switchWorkingTab_SS");
            await this.switchWorkingTabBase(contextIndex, pageIndex, page.pageType);
        });
        return page;
    }

    async openNewTab<T extends BasePage>(targetContext: "newContext" | "currentContext", page: T): Promise<T> {
        return await test.step("openNewTab", async() => {
            await this.openNewTabBase(targetContext);
            const targetIsNewContext = targetContext === "newContext";
            const targetContextIndex = targetIsNewContext ? this.lastContextIndex : this.workingContextIndex;
            const newTabIndex = this.lastTabIndex(targetContextIndex);
            if (targetIsNewContext)
                this.testManager.initializeContextPageTypes();
            this.testManager.initializeTabPageType(targetContextIndex, newTabIndex);
            await this.switchWorkingTabBase(targetContextIndex, newTabIndex, defaultTabPageType);
            return page;
        });
    }
    
    async switchWorkingTab<T extends BasePage>(contextIndex: number, pageIndex: number, page: T): Promise<T> {
        return await test.step("switchWorkingTab", async() => {
            console.log("switchWorkingTabAsync")
            await this.switchWorkingTabBase(contextIndex, pageIndex, page.pageType);
            return page;
        });
    }
}