import { APIRequestContext, expect } from "@playwright/test";
import AuthUrls from "../services/Auth/AuthUrls";
import CredentialsUtils from "../utils/CredentialsUtils";
import { StorageState } from "../customTypes/FrameworkTypes";
import { LoginResponse } from "../customTypes/ApiResponseTypes";
import FileUtils from "../utils/FileUtils";

export default class StorageStateHelper {

    private readonly _authUrls;

    constructor(_baseUrl: string) {
        this._authUrls = new AuthUrls(_baseUrl);
    }

    private _storageStatePath(user: string) { return `.auth/${user}.json`; }

    storageStateValue(user?: string) {
        let storageStateValue: string | undefined = undefined;
        if (user) {
            const storageStatePath = this._storageStatePath(user);
            if (FileUtils.fileExists(storageStatePath))
                storageStateValue = storageStatePath;
        }
        return storageStateValue;
    }

    private async generateStorageStateFile(workingRequest: APIRequestContext, user: string) {
        const storageStatePath = this._storageStatePath(user);
        console.log(`Generating ${storageStatePath}`)
        const credentials = CredentialsUtils.getUserCredentials(user);
        const response = await workingRequest.post(this._authUrls.login, { data: credentials });
        expect(response.status()).toEqual(200);
        const responseJson = await response.json() as LoginResponse;
        const storageStateTemplate = JSON.parse(FileUtils.readFile("./resources/other/restfulBookerStorageStateTemplate.json")) as StorageState;
        storageStateTemplate.cookies[0].value = responseJson.token;
        FileUtils.writeFile(storageStatePath, JSON.stringify(storageStateTemplate, null, 2));
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

    async generateStorageStateFileIfNeededViaAPI(workingRequest: APIRequestContext, authenticatedUser: string) {
        const storageStatePath = this._storageStatePath(authenticatedUser);
        if (FileUtils.fileExists(storageStatePath)) {
            const workingContextIsAuthorized = await this.contextIsAuthorized(workingRequest);
            if (!workingContextIsAuthorized) {
                await this.generateStorageStateFile(workingRequest, authenticatedUser);
                return true;
            }
        } else {
            await this.generateStorageStateFile(workingRequest, authenticatedUser);
            return true;
        }
        return false;
    }
}