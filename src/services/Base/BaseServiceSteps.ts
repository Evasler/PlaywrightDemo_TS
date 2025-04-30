import StepSequenceHelper from "../../helpers/chaining/StepSequenceHelper";
import RequestHelper from "../../helpers/channel/RequestHelper";
import TempDataHelper from "../../helpers/chaining/TempDataHelper";
import { TempDataKeys } from "../../customTypes/FrameworkTypes";

/**
 * Provides basic functionality shared across all ServiceSteps classes.
 */
export default abstract class BaseServiceSteps {

    constructor(private readonly _requestHelper: RequestHelper, private readonly _stepSequenceHelper: StepSequenceHelper, private readonly _tempDataHelper: TempDataHelper) { }
    
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
     * The focused Request Context.
     */
    protected get workingRequest() { return this._requestHelper.workingRequestContext; }

    /**
     * Stores extra headers, for the focused Request Context.
     * @param key 
     * @param value
     */
    protected putExtraHeader(key: string, value: string) { this._requestHelper.putExtraHeader(key, value); }

    /**
     * Stores the value in the Array of values of the specified key.
     * @param key 
     * @param value 
     */
    protected pushTempData(key: TempDataKeys, value: string) {
        this._tempDataHelper.pushTempData(key, value);
    }
    
    /**
     * @param key 
     * @param index 
     * @returns The value at index location of the Array of specified key.
     */
    protected getTempData(key: TempDataKeys, index: number) {
        return this._tempDataHelper.getTempData(key, index);
    }

    /**
     * @returns The stepSequence promise to be executed.
     */
    _execute() {
        return this._stepSequenceHelper.stepSequence;
    }

    /**
     * Opens a new Request Context. The new Request Context is focused.
     * @param serviceSteps The steps to be suggested for method-chaining.
     * @param authenticatedUser Allows avoiding the login process, by loading the user's storageState file in the Request Context.
     */
    _openNewContext<T extends BaseServiceSteps>(serviceSteps: T, authenticatedUser?: string) {
        this._requestHelper.openNewContext(authenticatedUser);
        return serviceSteps;
    }

    /**
     * Sets the focused Request Context.
     * @param contextIndex 
     * @param serviceSteps The steps to be suggested for method-chaining.
     */
    _switchWorkingContext<T extends BaseServiceSteps>(contextIndex: number, serviceSteps: T) {
        this._requestHelper.switchWorkingContext(contextIndex);
        return serviceSteps;
    }

    /**
     * @param serviceSteps The steps to be suggested for method-chaining.
     * @returns 
     */
    _switchService<T extends BaseServiceSteps>(serviceSteps: T) {
        return serviceSteps;
    }
}