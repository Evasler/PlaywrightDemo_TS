import { APIRequest, APIRequestContext, expect } from "@playwright/test";
import { storageStateValue } from "./StorageStateHelper";

export class RequestHelper {

    private readonly _requestContexts: APIRequestContext[] = [];

    private _workingRequestContext!: APIRequestContext;

    constructor(private readonly _apiRequest: APIRequest) { }

    get workingRequestContext() {
        return this._workingRequestContext;
    }

    get workingRequestContextIndex() {
        return this._requestContexts.indexOf(this.workingRequestContext);
    }

    updateWorkingRequestContext(requestContextIndex: number) {
        this._workingRequestContext = this._requestContexts[requestContextIndex];
    }
    
    async openNewContext(sharedUser?: string) {
        let newContext = await this._apiRequest.newContext({ storageState: storageStateValue(sharedUser) });
        this._requestContexts.push(newContext);
        this.updateWorkingRequestContext(this._requestContexts.length - 1);
    }

    async switchWorkingContext(requestContextIndex: number) {
        expect(requestContextIndex, `Context [${requestContextIndex}] not found`).toBeLessThan(this._requestContexts.length);
        expect(requestContextIndex, `Already working on context [${requestContextIndex}]`).not.toEqual(this.workingRequestContextIndex);
        this.updateWorkingRequestContext(requestContextIndex);
    }
}