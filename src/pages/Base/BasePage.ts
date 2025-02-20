import { PageType } from "../../customTypes/CustomTypes";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BrowserHelper } from "../../helpers/BrowserHelper";
import test from "@playwright/test";

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

    openNewTabInNewContext<T extends BasePage>(page: T, sharedStorageStateUser?: string): T {
        this.addStep("openNewTabInNewContext", async() => {
            console.log("openNewTabInNewContext");
            await this.browserHelper.openNewTabInNewContext(sharedStorageStateUser);
        });
        return page;
    }

    openNewTabInCurrentContext<T extends BasePage>(page: T): T {
        this.addStep("openNewTabInCurrentContext", async() => {
            console.log("openNewTabInCurrentContext");
            await this.browserHelper.openNewTabInCurrentContext();
        });
        return page;
    }

    switchWorkingTab<T extends BasePage>(contextIndex: number, pageIndex: number, page: T): T {
        this.addStep("switchWorkingTab", async() => {
            console.log("switchWorkingTab");
            await this.browserHelper.switchWorkingTab(contextIndex, pageIndex, page.pageType);
        });
        return page;
    }

    async openNewTabInNewContext_async<T extends BasePage>(page: T, storageStateUser?: string): Promise<T> {
        return await test.step("openNewTabInNewContext_async", async() => {
            console.log("openNewTabInNewContext_async");
            await this.browserHelper.openNewTabInNewContext(storageStateUser);
            return page;
        });
    }

    async openNewTabInCurrentContext_async<T extends BasePage>(page: T): Promise<T> {
        return await test.step("openNewTabInCurrentContext_async", async() => {
            console.log("openNewTabInCurrentContext_async");
            await this.browserHelper.openNewTabInCurrentContext();
            return page;
        });
    }
    
    async switchWorkingTab_async<T extends BasePage>(contextIndex: number, pageIndex: number, page: T): Promise<T> {
        return await test.step("switchWorkingTab_async", async() => {
            console.log("switchWorkingTab_async")
            await this.browserHelper.switchWorkingTab(contextIndex, pageIndex, page.pageType);
            return page;
        });
    }
}