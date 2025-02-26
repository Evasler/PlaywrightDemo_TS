import { APIRequestContext } from "@playwright/test";
import { getUserCredentials } from "./CredentialsHelper";
import { fileExists } from "../utils/FileUtils";
import { AuthUrls } from "../services/Auth/AuthUrls";

function storageStatePath(user: string) { return `.auth/${user}.json`; }

export function storageStateValue(user?: string) {
    let storageStateValue: string | undefined = undefined;
    if (user) {
        const _storageStatePath = storageStatePath(user);
        if (fileExists(_storageStatePath))
            storageStateValue = _storageStatePath;
    }
    return storageStateValue;
}

export class StorageStateHelper {

    private readonly _authUrls;

    constructor(_baseUrl: string) {
        this._authUrls = new AuthUrls(_baseUrl);
    }

    private async authorizeContext(workingRequest: APIRequestContext, user: string) {
        const credentials = getUserCredentials(user)
        await workingRequest.post(this._authUrls.login, { data: credentials });
    }

    private async saveStorageState(workingRequest: APIRequestContext, storageStatePath: string) {
        console.log(`Creating ${storageStatePath}`);
        await workingRequest.storageState({ path: storageStatePath});
    }

    private async contextIsAuthorized(workingRequest: APIRequestContext) {
        const token = (await workingRequest.storageState()).cookies[0].value;
        const response = await workingRequest.post(this._authUrls.validate, { data: { token: token } });
        const responseIsOk = response.ok();
        console.log(`Context is ${responseIsOk ? "authorized" : "unauthorized"}`);
        return responseIsOk;
    }

    async generateStorageStateFileIfNeededViaAPI(workingRequest: APIRequestContext, sharedUser: string) {
        const _storageStatePath = storageStatePath(sharedUser);
        if (fileExists(_storageStatePath)) {
            const workingContextIsAuthorized = await this.contextIsAuthorized(workingRequest);
            if (!workingContextIsAuthorized) {
                await this.authorizeContext(workingRequest, sharedUser);
                await this.saveStorageState(workingRequest, _storageStatePath);
            }
        } else {
            await this.authorizeContext(workingRequest, sharedUser);
            await this.saveStorageState(workingRequest, _storageStatePath);
        }
    }
}