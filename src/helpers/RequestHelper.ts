import { APIRequest, APIRequestContext, expect } from "@playwright/test";
import { StorageStateHelper, storageStateValue } from "./StorageStateHelper";

export class RequestHelper {

    private readonly _requestContexts: APIRequestContext[] = [];
    private readonly _storageStateHelper;
    private readonly _extraHeaders: { [key: string]: string; }[] = [];

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
    
    async openNewContext(sharedUser?: string) {
        let newContext = await this._apiRequest.newContext({ storageState: storageStateValue(sharedUser) });
        this._workingRequestContext = newContext;
        if (sharedUser) {
            const generatedFile = await this._storageStateHelper.generateStorageStateFileIfNeededViaAPI(this.workingRequestContext, sharedUser);
            if (generatedFile)
                newContext = await this._apiRequest.newContext({ storageState: storageStateValue(sharedUser) });
        }
        this._requestContexts.push(newContext);
        this.updateWorkingRequestContext(this._requestContexts.length - 1);
    }

    async switchWorkingContext(requestContextIndex: number) {
        expect(requestContextIndex, `Context [${requestContextIndex}] not found`).toBeLessThan(this._requestContexts.length);
        expect(requestContextIndex, `Already working on context [${requestContextIndex}]`).not.toEqual(this.workingRequestContextIndex);
        this.updateWorkingRequestContext(requestContextIndex);
    }
}