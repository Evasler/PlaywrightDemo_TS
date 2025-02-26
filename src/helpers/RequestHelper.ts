import { APIRequest, APIRequestContext, expect } from "@playwright/test";
import { getUserCredentials } from "./CredentialsHelper";
import fs from "fs";
import { SharedStorageStateEndpoints } from "../customTypes/CustomTypes";

export class RequestHelper {

    private readonly _requestContexts: APIRequestContext[] = [];

    private _workingRequestContext!: APIRequestContext;

    constructor(private readonly _apiRequest: APIRequest, private readonly sharedStorageStateEndpoints: SharedStorageStateEndpoints) { }

    get workingRequestContext() {
        return this._workingRequestContext;
    }

    get workingRequestContextIndex() {
        return this._requestContexts.indexOf(this.workingRequestContext);
    }

    updateWorkingRequestContext(requestContextIndex: number) {
        this._workingRequestContext = this._requestContexts[requestContextIndex];
    }
    
    async openNewContext(sharedStorageStateUser?: string) {
        if (!sharedStorageStateUser) {
            this._requestContexts.push(await this._apiRequest.newContext());
        } else {
            const userCredentials = getUserCredentials(sharedStorageStateUser);
            const storageStatePath = `.auth/${sharedStorageStateUser}.json`;
            if (!fs.existsSync(storageStatePath)) {
                await this.saveStorageState(userCredentials.username, userCredentials.password, storageStatePath);
            }
            if (!await this.storageStateIsValid(storageStatePath)) {
                await this.saveStorageState(userCredentials.username, userCredentials.password, storageStatePath);
            }
            this._requestContexts.push(await this._apiRequest.newContext({ storageState: storageStatePath }));
        }
        this.updateWorkingRequestContext(this._requestContexts.length - 1);
    }

    async switchWorkingContext(requestContextIndex: number) {
        expect(requestContextIndex, `Context [${requestContextIndex}] not found`).toBeLessThan(this._requestContexts.length);
        expect(requestContextIndex, `Already working on context [${requestContextIndex}]`).not.toEqual(this.workingRequestContextIndex);
        this.updateWorkingRequestContext(requestContextIndex);
    }
        
    async saveStorageState(username: string, password: string, storageStatePath: string) {
        if (!this.sharedStorageStateEndpoints.authentication)
            throw new Error("authenticationEndpoint is undefined");
        const request = await this._apiRequest.newContext();
        await request.post(this.sharedStorageStateEndpoints.authentication, {
            data: {
                username: username,
                password: password
            }
        });
        await request.storageState({ path: storageStatePath});
        console.log(`Created ${storageStatePath}`);
    }

    async storageStateIsValid(storageStatePath: string) {
        if (!this.sharedStorageStateEndpoints.validation)
            throw new Error("validationEndpoint is undefined");
        const tokenValue = JSON.parse(fs.readFileSync(storageStatePath).toString())["cookies"][0].value;
        const loggedInRequest = await this._apiRequest.newContext({ storageState: storageStatePath });
        const response = await loggedInRequest.post(this.sharedStorageStateEndpoints.validation, {
            data: {
                token: tokenValue
            }
        });
        console.log(`Verified ${storageStatePath} is ${response.ok() ? "valid" : "invalid"}`);
        return response.ok();
    }
}