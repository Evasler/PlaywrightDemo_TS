import test from "@playwright/test";
import { PageType } from "../../customTypes/FrameworkTypes";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BrowserHelper } from "../../helpers/BrowserHelper";
import { DataHelper } from "../../helpers/DataHelper";

export abstract class BasePage {

    constructor(private readonly _pageType: PageType, private readonly _browserHelper: BrowserHelper, private readonly _stepSequenceHelper: StepSequenceHelper, private readonly _dataHelper: DataHelper) { }

    protected addStep(title: string, callback: () => Promise<void>) {
        this._stepSequenceHelper.addStep(async() => {
            await test.step(title, callback);
        });
    }

    protected get workingTab() { return this._browserHelper.workingTab; }

    protected setTempData<T extends string | number | boolean>(key: string, value: T) {
        this._dataHelper.setTempData(key, value);
    }
    
    protected getTempStringData(key: string) {
        return this._dataHelper.getTempStringData(key);
    }

    protected getTempNumberData(key: string) {
        return this._dataHelper.getTempNumberData(key);
    }

    protected getTempBooleanData(key: string) {
        return this._dataHelper.getTempBooleanData(key);
    }

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