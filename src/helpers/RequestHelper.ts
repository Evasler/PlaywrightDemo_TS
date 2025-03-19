import { APIRequest, APIRequestContext, expect } from "@playwright/test";
import { StorageStateHelper } from "./StorageStateHelper";
import { StepSequenceHelper } from "./StepSequenceHelper";

export class RequestHelper {

    private readonly _requestContexts: APIRequestContext[] = [];
    private readonly _storageStateHelper;
    private readonly _extraHeaders: { [key: string]: string; }[] = [];

    private _workingRequestContext!: APIRequestContext;

    constructor(private readonly _apiRequest: APIRequest, private readonly _stepSequenceHelper: StepSequenceHelper, baseUrl: string) {
        this._storageStateHelper = new StorageStateHelper(baseUrl);
    }

    get workingRequestContext() {
        return this._workingRequestContext;
    }

    get workingRequestContextIndex() {
        return this._requestContexts.indexOf(this.workingRequestContext);
    }

    putExtraHeader(contextIndex: number, key: string, value: string) {
        if(!this._extraHeaders[contextIndex])
            this._extraHeaders[contextIndex] = {};
        this._extraHeaders[contextIndex][key] = value;
    }

    getExtraHeaders(contextIndex: number) {
        return this._extraHeaders[contextIndex];
    }

    updateWorkingRequestContext(requestContextIndex: number) {
        this._workingRequestContext = this._requestContexts[requestContextIndex];
    }
    
    openNewContext(authenticatedUser?: string) {
        this._stepSequenceHelper.addStep("openNewContext", async () => {
            console.log("openNewContext");
            let newContext = await this._apiRequest.newContext({ storageState: this._storageStateHelper.storageStateValue(authenticatedUser) });
            if (authenticatedUser) {
                const generatedFile = await this._storageStateHelper.generateStorageStateFileIfNeededViaAPI(newContext, authenticatedUser);
                if (generatedFile)
                    newContext = await this._apiRequest.newContext({ storageState: this._storageStateHelper.storageStateValue(authenticatedUser) });
            }
            this._requestContexts.push(newContext);
            this.updateWorkingRequestContext(this._requestContexts.length - 1);
        });
    }
    
    openNewThrowAwayContext(authenticatedUser?: string) {
        this._stepSequenceHelper.addStep("openNewThrowAwayContext", async () => {
            console.log("openNewThrowAwayContext");
            let newContext = await this._apiRequest.newContext({ storageState: this._storageStateHelper.storageStateValue(authenticatedUser) });
            if (authenticatedUser) {
                const generatedFile = await this._storageStateHelper.generateStorageStateFileIfNeededViaAPI(newContext, authenticatedUser);
                if (generatedFile)
                    newContext = await this._apiRequest.newContext({ storageState: this._storageStateHelper.storageStateValue(authenticatedUser) });
            }
            this._workingRequestContext = newContext;
        });
    }

    switchWorkingContext(requestContextIndex: number) {
        this._stepSequenceHelper.addStep("switchWorkingContext", async () => {
            console.log("switchWorkingContext");
            expect(requestContextIndex, `Context [${requestContextIndex}] not found`).toBeLessThan(this._requestContexts.length);
            expect(requestContextIndex, `Already working on context [${requestContextIndex}]`).not.toEqual(this.workingRequestContextIndex);
            this.updateWorkingRequestContext(requestContextIndex);
        });
    }
}