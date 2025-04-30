import { APIRequest, APIRequestContext, expect } from "@playwright/test";
import StorageStateHelper from "../chaining/StorageStateHelper";
import StepSequenceHelper from "../chaining/StepSequenceHelper";

/**
 * Manages all actions related to the Request Context.
 * Holds a reference to the focused Request Context and all Request Contexts created by openNewContext and openNewThrowAwayContext.
 * A set of extra headers is stored for each Request Context and can be applied to its requests. 
 */
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

    /**
     * The focused Request Context.
     */
    get workingRequestContext() {
        return this._workingRequestContext;
    }

    /**
     * The index of the focused Request Context.
     */
    get workingRequestContextIndex() {
        return this._requestContexts.indexOf(this.workingRequestContext);
    }

    /**
     * Stores extra headers, for the focused Request Context.
     * @param key 
     * @param value 
     */
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

    /**
     * Throws error if the focused Request Context is not stored.
     * @returns The extra headers for the focused Request Context.
     */
    getExtraHeaders() {
        const contextIndex = this._requestContexts.indexOf(this.workingRequestContext);
        if (contextIndex >= 0)
            return this._requestContextsExtraHeaders[contextIndex];
        const throwAwayContextIndex = this._throwAwayContexts.indexOf(this.workingRequestContext);
        if (throwAwayContextIndex >= 0)
            return this._throwAwayContextsExtraHeaders[throwAwayContextIndex];
        throw new Error("Could not find workingRequestContext's Extra Headers")
    }

    /**
     * Sets the focused Request Context.
     * @param requestContextIndex 
     */
    private _updateWorkingRequestContext(requestContextIndex: number) {
        this._workingRequestContext = this._requestContexts[requestContextIndex];
    }
    
    /**
     * Opens a new Request Context. The new Request Context is focused. If needed it can be focused again by switchWorkingContext.
     * @param authenticatedUser Allows avoiding the login process, by loading the user's storageState file in the Request Context.
     */
    openNewContext(authenticatedUser?: string) {
        this._stepSequenceHelper.addStep("openNewContext", async () => {
            console.log("openNewContext");
            let newContext = await this._apiRequest.newContext({ storageState: this._storageStateHelper.storageStateValue(authenticatedUser) });
            if (authenticatedUser) {
                const generatedFile = await this._storageStateHelper.createStorageStateFileIfNeededViaAPI(newContext, authenticatedUser);
                if (generatedFile)
                    newContext = await this._apiRequest.newContext({ storageState: this._storageStateHelper.storageStateValue(authenticatedUser) });
            }
            this._requestContexts.push(newContext);
            this._updateWorkingRequestContext(this._requestContexts.length - 1);
        });
    }
    
    /**
     * Opens a new Request Context. The new Request Context is focused. It cannot be focused again.
     * @param authenticatedUser Allows avoiding the login process, by loading the user's storageState file in the Request Context.
     */
    openNewThrowAwayContext(authenticatedUser?: string) {
        this._stepSequenceHelper.addStep("openNewThrowAwayContext", async () => {
            console.log("openNewThrowAwayContext");
            let newContext = await this._apiRequest.newContext({ storageState: this._storageStateHelper.storageStateValue(authenticatedUser) });
            if (authenticatedUser) {
                const generatedFile = await this._storageStateHelper.createStorageStateFileIfNeededViaAPI(newContext, authenticatedUser);
                if (generatedFile)
                    newContext = await this._apiRequest.newContext({ storageState: this._storageStateHelper.storageStateValue(authenticatedUser) });
            }
            this._throwAwayContexts.push(newContext);
            this._workingRequestContext = newContext;
        });
    }

    /**
     * Sets the focused Request Context.
     * @param requestContextIndex 
     */
    switchWorkingContext(requestContextIndex: number) {
        this._stepSequenceHelper.addStep("switchWorkingContext", async () => {
            console.log("switchWorkingContext");
            expect(requestContextIndex, `Context [${requestContextIndex}] not found`).toBeLessThan(this._requestContexts.length);
            expect(requestContextIndex, `Already working on context [${requestContextIndex}]`).not.toEqual(this.workingRequestContextIndex);
            this._updateWorkingRequestContext(requestContextIndex);
        });
    }
}