import StepSequenceHelper from "../../helpers/chaining/StepSequenceHelper";
import RequestHelper from "../../helpers/channel/RequestHelper";
import TempDataHelper from "../../helpers/chaining/TempDataHelper";

export default abstract class BaseServiceSteps {

    constructor(private readonly _requestHelper: RequestHelper, private readonly _stepSequenceHelper: StepSequenceHelper, private readonly _tempDataHelper: TempDataHelper) { }
        
    protected addStep(title: string, callback: () => Promise<void>) {
        this._stepSequenceHelper.addStep(title, callback);
    }

    protected get workingRequest() { return this._requestHelper.workingRequestContext; }

    protected putExtraHeader(key: string, value: string) { return this._requestHelper.putExtraHeader(key, value); }

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

    _openNewContext<T extends BaseServiceSteps>(serviceSteps: T, authenticatedUser?: string) {
        this._requestHelper.openNewContext(authenticatedUser);
        return serviceSteps;
    }

    _switchWorkingContext<T extends BaseServiceSteps>(contextIndex: number, serviceSteps: T) {
        this._requestHelper.switchWorkingContext(contextIndex);
        return serviceSteps;
    }

    _switchService<T extends BaseServiceSteps>(serviceSteps: T) {
        return serviceSteps;
    }
}