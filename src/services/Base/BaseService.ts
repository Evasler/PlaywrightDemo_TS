import test from "@playwright/test";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { RequestHelper } from "../../helpers/RequestHelper";

export abstract class BaseService {

    constructor(private readonly _requestHelper: RequestHelper, private readonly _stepSequenceHelper: StepSequenceHelper) { }
        
    protected addStep(title: string, callback: () => Promise<void>) {
        this._stepSequenceHelper.addStep(async() => {
            await test.step(title, callback);
        });
    }

    protected get workingRequest() { return this._requestHelper.workingRequestContext; }

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