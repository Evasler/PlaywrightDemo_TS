import test from "@playwright/test";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { RequestHelper } from "../../helpers/RequestHelper";
import { TempDataHelper } from "../../helpers/TempDataHelper";

export abstract class BaseService {

    constructor(private readonly _requestHelper: RequestHelper, private readonly _stepSequenceHelper: StepSequenceHelper, private readonly _tempDataHelper: TempDataHelper) { }
        
    protected addStep(title: string, callback: () => Promise<void>) {
        this._stepSequenceHelper.addStep(async() => {
            await test.step(title, callback);
        });
    }

    protected get workingRequest() { return this._requestHelper.workingRequestContext; }

    protected putExtraHeader(key: string, value: string) { return this._requestHelper.putExtraHeader(this._requestHelper.workingRequestContextIndex, key, value); }

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

    openNewContext<T extends BaseService>(serviceCategory: T, sharedUser?: string) {
        this.addStep("openNewContext", async() => {
            console.log("openNewContext");
            await this._requestHelper.openNewContext(sharedUser);
        });
        return serviceCategory;
    }

    switchWorkingContext<T extends BaseService>(contextIndex: number, serviceCategory: T) {
        this.addStep("switchWorkingTab", async() => {
            console.log("switchWorkingTab");
            await this._requestHelper.switchWorkingContext(contextIndex);
        });
        return serviceCategory;
    }

    switchServiceCategory<T extends BaseService>(serviceCategory: T) {
        return serviceCategory;
    }
}