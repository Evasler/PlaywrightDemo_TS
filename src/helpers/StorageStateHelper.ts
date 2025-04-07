import { APIRequestContext, expect, Page } from "@playwright/test";
import AuthUrls from "../services/Auth/AuthUrls";
import CredentialsUtils from "../utils/CredentialsUtils";
import { StorageState } from "../customTypes/FrameworkTypes";
import { LoginResponse } from "../customTypes/ApiResponseTypes";
import FileUtils from "../utils/FileUtils";

export default class StorageStateHelper {

    private readonly _authUrls;
    private readonly _loginPageUrl;

    constructor(_baseUrl: string) {
        this._authUrls = new AuthUrls(_baseUrl);
        this._loginPageUrl = `${_baseUrl}admin`;
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

    private async _generateStorageStateFileViaAPI(workingRequest: APIRequestContext, user: string) {
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

    private async _contextIsAuthorizedViaAPI(workingRequest: APIRequestContext) {
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
            const workingContextIsAuthorized = await this._contextIsAuthorizedViaAPI(workingRequest);
            if (!workingContextIsAuthorized) {
                await this._generateStorageStateFileViaAPI(workingRequest, authenticatedUser);
                return true;
            }
        } else {
            await this._generateStorageStateFileViaAPI(workingRequest, authenticatedUser);
            return true;
        }
        return false;
    }

    //====================================================================

    private async _generateStorageStateFileViaUI(workingTab: Page, user: string) {
        const storageStatePath = this._storageStatePath(user);
        console.log(`Generating ${storageStatePath}`)
        const credentials = CredentialsUtils.getUserCredentials(user);
        await workingTab.goto(this._loginPageUrl);
        await workingTab.getByRole("textbox", { name: "Username", exact: true }).fill(credentials.username);
        await workingTab.getByRole("textbox", { name: "Password", exact: true }).fill(credentials.password);
        await workingTab.getByRole("button", { name: "Login", exact: true }).click();
        await expect(workingTab.getByRole("link", {name: "Rooms", exact: true})).toBeVisible();
        await workingTab.context().storageState({ path: storageStatePath });
    }

    private async _contextIsAuthorizedViaUI(workingTab: Page) {
        if (workingTab.url() !== this._loginPageUrl)
            await workingTab.goto(this._loginPageUrl);
        try {
            await expect(workingTab.getByRole("link", {name: "Rooms", exact: true})).toBeVisible({ timeout: 5000 });
            console.log("Context is authorized");
            return true;
        } catch {
            console.log("Context is unauthorized");
            return false;
        }
    }

    async generateStorageStateFileIfNeededViaUI(workingTab: Page, authenticatedUser: string) {
        const storageStatePath = this._storageStatePath(authenticatedUser);
        if (FileUtils.fileExists(storageStatePath)) {
            const workingContextIsAuthorized = await this._contextIsAuthorizedViaUI(workingTab);
            if (!workingContextIsAuthorized) {
                await this._generateStorageStateFileViaUI(workingTab, authenticatedUser);
                return true;
            }
        } else {
            await this._generateStorageStateFileViaUI(workingTab, authenticatedUser);
            return true;
        }
        return false;
    }
}