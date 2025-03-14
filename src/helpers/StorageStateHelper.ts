import { APIRequestContext, expect } from "@playwright/test";
import { AuthUrls } from "../services/Auth/AuthUrls";
import { getUserCredentials } from "./CredentialsHelper";
import { StorageState } from "../customTypes/FrameworkTypes";
import { LoginResponse } from "../customTypes/ApiResponseTypes";
import { fileExists, readFile, writeFile } from "../utils/FileUtils";

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

    private async generateStorageStateFile(workingRequest: APIRequestContext, user: string) {
        const _storageStatePath = storageStatePath(user);
        console.log(`Generating ${_storageStatePath}`)
        const credentials = getUserCredentials(user)
        const response = await workingRequest.post(this._authUrls.login, { data: credentials });
        expect(response.status()).toEqual(200);
        const responseJson = await response.json() as LoginResponse;
        const storageStateTemplate = JSON.parse(readFile("./resources/other/restfulBookerStorageStateTemplate.json")) as StorageState;
        storageStateTemplate.cookies[0].value = responseJson.token;
        writeFile(_storageStatePath, JSON.stringify(storageStateTemplate, null, 2));
    }

    private async contextIsAuthorized(workingRequest: APIRequestContext) {
        let contextIsAuthorized = false;
        const tokenCookie = (await workingRequest.storageState()).cookies.find(cookie => cookie.name === "token");
        if (tokenCookie) {
            const token = tokenCookie.value;
            const response = await workingRequest.post(this._authUrls.validate, { data: { token: token } });
            contextIsAuthorized = response.ok();
        }
        console.log(`Context is ${contextIsAuthorized ? "authorized" : "unauthorized"}`);
        return contextIsAuthorized;
    }

    async generateStorageStateFileIfNeededViaAPI(workingRequest: APIRequestContext, sharedUser: string) {
        const _storageStatePath = storageStatePath(sharedUser);
        if (fileExists(_storageStatePath)) {
            const workingContextIsAuthorized = await this.contextIsAuthorized(workingRequest);
            if (!workingContextIsAuthorized) {
                await this.generateStorageStateFile(workingRequest, sharedUser);
                return true;
            }
        } else {
            await this.generateStorageStateFile(workingRequest, sharedUser);
            return true;
        }
        return false;
    }
}