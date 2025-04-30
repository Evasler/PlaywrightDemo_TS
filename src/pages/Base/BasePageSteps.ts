import { PageType } from "../../customTypes/FrameworkTypes";
import StepSequenceHelper from "../../helpers/chaining/StepSequenceHelper";
import BrowserHelper from "../../helpers/channel/BrowserHelper";
import TempDataHelper from "../../helpers/chaining/TempDataHelper";

/**
 * Provides basic functionality shared across all PageSteps classes.
 */
export default abstract class BasePageSteps {

    constructor(private readonly _pageType: PageType, private readonly _browserHelper: BrowserHelper, private readonly _stepSequenceHelper: StepSequenceHelper, private readonly _tempDataHelper: TempDataHelper) { }

    /**
     * Adds a step to the stepSequence promise.
     * If a step fails, the error's callstack will be updated to point to the proper row of the .spec.ts file. 
     * @param title 
     * @param callback 
     */
    protected addStep(title: string, callback: () => Promise<void>) {
        this._stepSequenceHelper.addStep(title, callback);
    }

    /**
     * The focused Tab.
     */
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

    /**
     * @returns The stepSequence promise to be executed.
     */
    _execute() {
        return this._stepSequenceHelper.stepSequence;
    }

    /**
     * Opens a new Tab in a new Context. The new Tab is focused.
     * @param pageSteps The steps to be suggested for method-chaining.
     * @param authenticatedUser Allows avoiding the login process, by loading the user's storageState file in the Context.
     */
    _openNewTabInNewContext<T extends BasePageSteps>(pageSteps: T, authenticatedUser?: string): T {
        this._browserHelper.openNewTabInNewContext(authenticatedUser);
        return pageSteps;
    }

    /**
     * Opens a new Tab in the Context of the focused Tab's Context. The new Tab is focused.
     * @param pageSteps The steps to be suggested for method-chaining.
     */
    _openNewTabInCurrentContext<T extends BasePageSteps>(pageSteps: T): T {
        this._browserHelper.openNewTabInCurrentContext();
        return pageSteps;
    }

    /**
     * Verifies the target Tab's pageType and sets the focused Tab.
     * @param contextIndex 
     * @param pageIndex 
     * @param pageSteps The steps to be suggested for method-chaining.
     */
    _switchWorkingTab<T extends BasePageSteps>(contextIndex: number, pageIndex: number, pageSteps: T): T {
        this._browserHelper.switchWorkingTab(contextIndex, pageIndex, pageSteps._pageType);
        return pageSteps;
    }
}