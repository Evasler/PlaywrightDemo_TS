import test from "@playwright/test";
import { PageType } from "../../customTypes/FrameworkTypes";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BrowserHelper } from "../../helpers/BrowserHelper";
import { TempDataHelper } from "../../helpers/TempDataHelper";

export abstract class BasePage {

    constructor(private readonly _pageType: PageType, private readonly _browserHelper: BrowserHelper, private readonly _stepSequenceHelper: StepSequenceHelper, private readonly _tempDataHelper: TempDataHelper) { }

    protected addStep(title: string, callback: () => Promise<void>) {
        this._stepSequenceHelper.addStep(title, callback);
    }

    protected get workingTab() { return this._browserHelper.workingTab; }

    protected setTempData<T extends string | number | boolean>(key: string, value: T) {
        this._tempDataHelper.setTempData(key, value);
    }
    
    protected getTempStringData(key: string) {
        return this._tempDataHelper.getTempStringData(key);
    }

    protected getTempNumberData(key: string) {
        return this._tempDataHelper.getTempNumberData(key);
    }

    protected getTempBooleanData(key: string) {
        return this._tempDataHelper.getTempBooleanData(key);
    }

    execute() {
        return this._stepSequenceHelper.stepSequence;
    }

    openNewTabInNewContext<T extends BasePage>(page: T, authenticatedUser?: string): T {
        this._browserHelper.openNewTabInNewContext(authenticatedUser);
        return page;
    }

    openNewTabInCurrentContext<T extends BasePage>(page: T): T {
        this._browserHelper.openNewTabInCurrentContext();
        return page;
    }

    switchWorkingTab<T extends BasePage>(contextIndex: number, pageIndex: number, page: T): T {
        this._browserHelper.switchWorkingTab(contextIndex, pageIndex, page._pageType);
        return page;
    }
}