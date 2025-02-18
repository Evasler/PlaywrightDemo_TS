import { PageType } from "../../customTypes/PageTypes";
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

    openNewTabInNewContext_SS<T extends BasePage>(page: T, storageStateUser?: string): T {
        this.addStep("openNewTabInNewContext_SS", async() => {
            console.log("openNewTab_SS");
            await this.browserHelper.openNewTabInNewContext(storageStateUser);
        });
        return page;
    }

    openNewTabInCurrentContext_SS<T extends BasePage>(page: T): T {
        this.addStep("openNewTab_SS", async() => {
            console.log("openNewTabInCurrentContext_SS");
            await this.browserHelper.openNewTabInCurrentContext();
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

    async openNewTabInNewContext<T extends BasePage>(page: T, storageStateUser?: string): Promise<T> {
        return await test.step("openNewTab", async() => {
            console.log("openNewTabInNewContext");
            await this.browserHelper.openNewTabInNewContext(storageStateUser);
            return page;
        });
    }

    async openNewTabInCurrentContext<T extends BasePage>(page: T): Promise<T> {
        return await test.step("openNewTab", async() => {
            console.log("openNewTabInCurrentContext");
            await this.browserHelper.openNewTabInCurrentContext();
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