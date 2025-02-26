import test from "@playwright/test";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { RequestHelper } from "../../helpers/RequestHelper";
import { StorageStateHelper } from "../../helpers/StorageStateHelper";

export abstract class BaseService {

    constructor(private readonly _requestHelper: RequestHelper, private readonly _stepSequenceHelper: StepSequenceHelper, private readonly _storageStateHelper: StorageStateHelper) { }
        
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
            if (sharedUser)
                await this._storageStateHelper.generateStorageStateFileIfNeededViaAPI(this.workingRequest, sharedUser);
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