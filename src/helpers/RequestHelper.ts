import { APIRequest, APIRequestContext, expect } from "@playwright/test";
import StorageStateHelper from "./StorageStateHelper";
import StepSequenceHelper from "./StepSequenceHelper";

export default class RequestHelper {

    private readonly _storageStateHelper;
    private readonly _requestContexts: APIRequestContext[] = [];
    private readonly _throwAwayContexts: APIRequestContext[] = [];
    private readonly _requestContextsExtraHeaders: { [key: string]: string; }[] = [];
    private readonly _throwAwayContextsExtraHeaders: { [key: string]: string; }[] = [];

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

    putExtraHeader(key: string, value: string) {
        const contextIndex = this._requestContexts.indexOf(this.workingRequestContext);
        if (contextIndex >= 0) {
            if(!this._requestContextsExtraHeaders[contextIndex])
                this._requestContextsExtraHeaders[contextIndex] = {};
            this._requestContextsExtraHeaders[contextIndex][key] = value;
            return;
        }
        const throwAwayContextIndex = this._throwAwayContexts.indexOf(this.workingRequestContext);
        if (throwAwayContextIndex >= 0) {
            if(!this._throwAwayContextsExtraHeaders[throwAwayContextIndex])
                this._throwAwayContextsExtraHeaders[throwAwayContextIndex] = {};
            this._throwAwayContextsExtraHeaders[throwAwayContextIndex][key] = value;
        }
    }

    getExtraHeaders() {
        const contextIndex = this._requestContexts.indexOf(this.workingRequestContext);
        if (contextIndex >= 0)
            return this._requestContextsExtraHeaders[contextIndex];
        const throwAwayContextIndex = this._throwAwayContexts.indexOf(this.workingRequestContext);
        if (throwAwayContextIndex >= 0)
            return this._throwAwayContextsExtraHeaders[throwAwayContextIndex];
        throw new Error("Could not find workingRequestContext's Extra Headers")
    }

    private _updateWorkingRequestContext(requestContextIndex: number) {
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
            this._updateWorkingRequestContext(this._requestContexts.length - 1);
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
            this._throwAwayContexts.push(newContext);
            this._workingRequestContext = newContext;
        });
    }

    switchWorkingContext(requestContextIndex: number) {
        this._stepSequenceHelper.addStep("switchWorkingContext", async () => {
            console.log("switchWorkingContext");
            expect(requestContextIndex, `Context [${requestContextIndex}] not found`).toBeLessThan(this._requestContexts.length);
            expect(requestContextIndex, `Already working on context [${requestContextIndex}]`).not.toEqual(this.workingRequestContextIndex);
            this._updateWorkingRequestContext(requestContextIndex);
        });
    }
}