import { type APIRequestContext, type Page, expect } from "@playwright/test";
import { credentialsUtils, fileUtils } from "../../utils/index.js";
import type { StorageState, LoginResponse } from "../../types/index.js";
import frameworkDataHelper from "../data/frameworkDataHelper.js";

const authDirectory = ".auth";

/**
 * @param user 
 * @returns The relative path to the user's storageState file.
 */
function storageStatePath(user: string) { return `${authDirectory}/${user}.json`; }

/**
 * Saves the user's token in a storageState file, based on ./resources/other/restfulBookerStorageStateTemplate.json.
 * @param user 
 */
async function createStorageStateFileViaAPI(workingRequest: APIRequestContext, user: string) {
    console.log(`Generating ${storageStatePath(user)}`)
    const credentials = credentialsUtils.getUserCredentials(user);
    const response = await workingRequest.post(`${frameworkDataHelper.apiUrl}auth/login`, { data: credentials });
    expect(response.status()).toEqual(200);
    const responseJson = await response.json() as LoginResponse;
    const storageStateTemplate = JSON.parse(fileUtils.readFile("./resources/other/restfulBookerStorageStateTemplate.json")) as StorageState;
    storageStateTemplate.cookies[0].value = responseJson.token;
    if (!fileUtils.fileExists(authDirectory))
        fileUtils.makeDirectory(authDirectory);
    fileUtils.writeFile(storageStatePath(user), JSON.stringify(storageStateTemplate, null, 2));
}

/**
 * @param workingRequest 
 * @returns True, if the context's cookies include a valid token. Otherwise, false.
 */
async function contextIsAuthorizedViaAPI(workingRequest: APIRequestContext) {
    let contextIsAuthorized = false;
    const tokenCookie = (await workingRequest.storageState()).cookies.find(cookie => cookie.name === "token");
    if (tokenCookie) {
        const token = tokenCookie.value;
        const response = await workingRequest.post(`${frameworkDataHelper.apiUrl}auth/validate`, { data: { token: token } });
        contextIsAuthorized = response.ok();
    }
    console.log(`Context is ${contextIsAuthorized ? "authorized" : "unauthorized"}`);
    return contextIsAuthorized;
}

/**
 * The user is logged in via UI and their storageState file is created.
 * @param workingTab 
 * @param user 
 */
async function createStorageStateFileViaUI(workingTab: Page, user: string) {
    console.log(`Generating ${storageStatePath(user)}`)
    const credentials = credentialsUtils.getUserCredentials(user);
    await workingTab.goto(`${frameworkDataHelper.baseUrl}admin`);
    await workingTab.getByRole("textbox", { name: "Username", exact: true }).fill(credentials.username);
    await workingTab.getByRole("textbox", { name: "Password", exact: true }).fill(credentials.password);
    await workingTab.getByRole("button", { name: "Login", exact: true }).click();
    await expect(workingTab.getByRole("link", {name: "Rooms", exact: true})).toBeVisible();
    await workingTab.context().storageState({ path: storageStatePath(user) });
}

/**
 * Visits the login page.
 * @param workingTab 
 * @returns True, if the context's cookies are valid. Otherwise, false.
 */
async function contextIsAuthorizedViaUI(workingTab: Page) {
    if (workingTab.url() !== `${frameworkDataHelper.baseUrl}admin`)
        await workingTab.goto(`${frameworkDataHelper.baseUrl}admin`);
    try {
        await expect(workingTab.getByRole("link", {name: "Rooms", exact: true})).toBeVisible({ timeout: 5000 });
        console.log("Context is authorized");
        return true;
    } catch {
        console.log("Context is unauthorized");
        return false;
    }
}

/**
 * Facilitates the creation of storageState files.
 * Furthemore, ensures the validity of said storageState files.
 */
const storageStateHelper = {
    
    /**
     * @param user 
     * @returns The relative path to the user's storageState file, if it exists. Otherwise, undefined.
     */
    storageStatePath(user?: string) {
        if (!user)
            return undefined;
        if (!fileUtils.fileExists(storageStatePath(user)))
            return undefined;
        return storageStatePath(user);
    },

    /**
     * If authenticatedUser's storageState file doesn't exist, it is created.
     * If authenticatedUser's storageState file contains invalid cookies, it is refreshed.
     * @param authenticatedUser 
     * @returns True if a storageState file was created. Otherwise, false.
     */
    async createStorageStateFileIfNeededViaAPI(workingRequest: APIRequestContext, authenticatedUser: string) {
        if (fileUtils.fileExists(storageStatePath(authenticatedUser))) {
            const workingContextIsAuthorized = await contextIsAuthorizedViaAPI(workingRequest);
            if (!workingContextIsAuthorized) {
                await createStorageStateFileViaAPI(workingRequest, authenticatedUser);
                return true;
            }
        } else {
            await createStorageStateFileViaAPI(workingRequest, authenticatedUser);
            return true;
        }
        return false;
    },

    /**
     * If authenticatedUser's storageState file doesn't exist, it is created.
     * If authenticatedUser's storageState file contains invalid cookies, it is refreshed.
     * @param workingTab 
     * @param authenticatedUser 
     * @returns True if a storageState file was created. Otherwise, false.
     */
    async createStorageStateFileIfNeededViaUI(workingTab: Page, authenticatedUser: string) {
        if (fileUtils.fileExists(storageStatePath(authenticatedUser))) {
            const workingContextIsAuthorized = await contextIsAuthorizedViaUI(workingTab);
            if (!workingContextIsAuthorized) {
                await createStorageStateFileViaUI(workingTab, authenticatedUser);
                return true;
            }
        } else {
            await createStorageStateFileViaUI(workingTab, authenticatedUser);
            return true;
        }
        return false;
    }
}

export default storageStateHelper;