import { PageType } from "../../customTypes/FrameworkTypes";
import StepSequenceHelper from "../../helpers/chaining/StepSequenceHelper";
import BrowserHelper from "../../helpers/channel/BrowserHelper";
import TempDataHelper from "../../helpers/chaining/TempDataHelper";

export default abstract class BasePageSteps {

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

    _execute() {
        return this._stepSequenceHelper.stepSequence;
    }

    _openNewTabInNewContext<T extends BasePageSteps>(pageSteps: T, authenticatedUser?: string): T {
        this._browserHelper.openNewTabInNewContext(authenticatedUser);
        return pageSteps;
    }

    _openNewTabInCurrentContext<T extends BasePageSteps>(pageSteps: T): T {
        this._browserHelper.openNewTabInCurrentContext();
        return pageSteps;
    }

    _switchWorkingTab<T extends BasePageSteps>(contextIndex: number, pageIndex: number, pageSteps: T): T {
        this._browserHelper.switchWorkingTab(contextIndex, pageIndex, pageSteps._pageType);
        return pageSteps;
    }
}