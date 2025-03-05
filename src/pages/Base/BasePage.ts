import test from "@playwright/test";
import { PageType } from "../../customTypes/CustomTypes";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BrowserHelper } from "../../helpers/BrowserHelper";

export abstract class BasePage {

    constructor(private readonly _pageType: PageType, private readonly _browserHelper: BrowserHelper, private readonly _stepSequenceHelper: StepSequenceHelper) { }

    protected addStep(title: string, callback: () => Promise<void>) {
        this._stepSequenceHelper.addStep(async() => {
            await test.step(title, callback);
        });
    }

    protected get workingTab() { return this._browserHelper.workingTab; }

    execute() {
        return this._stepSequenceHelper.stepSequence;
    }

    openNewTabInNewContext<T extends BasePage>(page: T, sharedUser?: string): T {
        this.addStep("openNewTabInNewContext", async() => {
            console.log("openNewTabInNewContext");
            await this._browserHelper.openNewTabInNewContext(sharedUser);
        });
        return page;
    }

    openNewTabInCurrentContext<T extends BasePage>(page: T): T {
        this.addStep("openNewTabInCurrentContext", async() => {
            console.log("openNewTabInCurrentContext");
            await this._browserHelper.openNewTabInCurrentContext();
        });
        return page;
    }

    switchWorkingTab<T extends BasePage>(contextIndex: number, pageIndex: number, page: T): T {
        this.addStep("switchWorkingTab", async() => {
            console.log("switchWorkingTab");
            await this._browserHelper.switchWorkingTab(contextIndex, pageIndex, page._pageType);
        });
        return page;
    }
}