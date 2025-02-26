import { APIRequest, APIRequestContext, expect } from "@playwright/test";
import { StorageStateHelper, storageStateValue } from "./StorageStateHelper";

export class RequestHelper {

    private readonly _requestContexts: APIRequestContext[] = [];
    private readonly _storageStateHelper;

    private _workingRequestContext!: APIRequestContext;

    constructor(private readonly _apiRequest: APIRequest, baseUrl: string) {
        this._storageStateHelper = new StorageStateHelper(baseUrl);
    }

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
        if (sharedUser)
            await this._storageStateHelper.generateStorageStateFileIfNeededViaAPI(this.workingRequestContext, sharedUser);
    }

    async switchWorkingContext(requestContextIndex: number) {
        expect(requestContextIndex, `Context [${requestContextIndex}] not found`).toBeLessThan(this._requestContexts.length);
        expect(requestContextIndex, `Already working on context [${requestContextIndex}]`).not.toEqual(this.workingRequestContextIndex);
        this.updateWorkingRequestContext(requestContextIndex);
    }
}