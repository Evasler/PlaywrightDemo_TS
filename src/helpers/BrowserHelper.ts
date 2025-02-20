import { Browser, BrowserContext, expect, Page } from "@playwright/test";
import { ErrorListenerOptions, PageType, SharedStorageStateEndpoints } from "../customTypes/CustomTypes";
import { TabPageTypeHelper } from "./TabPageTypeHelper";
import { getUserCredentials } from "./CredentialsHelper";
import fs from "fs";
import { ErrorListener } from "../listeners/ErrorListener";

export class BrowserHelper {

    private readonly _errorListener: ErrorListener;
    private readonly _tabPageTypeHelper: TabPageTypeHelper;

    private _workingTab!: Page;

    constructor(
        private _workingBrowser: Browser, 
        private readonly sharedStorageState: SharedStorageStateEndpoints, 
        errorListenerOptions: ErrorListenerOptions
    ) {
        this._errorListener = new ErrorListener(errorListenerOptions);
        this._tabPageTypeHelper = new TabPageTypeHelper();
    }

    get workingBrowser() {
        return this._workingBrowser;
    }

    get workingContext() {
        return this.workingTab.context();
    }
    
    get workingTab() {
        return this._workingTab;
    }

    get workingContextIndex() {
        return this.workingBrowser.contexts().indexOf(this.workingContext);
    }

    get workingTabIndex() {
        return this.workingContext.pages().indexOf(this.workingTab);
    }
    
    get lastContextIndex() {
        return this.workingBrowser.contexts().length - 1;
    }

    lastTabIndex(contextIndex: number) {
        return this.workingBrowser.contexts()[contextIndex].pages().length - 1;
    }

    updateWorkingTab(contextIndex: number, tabIndex: number) {
        this._workingTab = this.workingBrowser.contexts()[contextIndex].pages()[tabIndex];
    }
    
    async openNewTabInCurrentContext() {
        const newPage = await this.workingContext.newPage();
        this._errorListener.attachTo(newPage);
        this._tabPageTypeHelper.initializeTabPageType(this.workingContextIndex, this.lastTabIndex(this.workingContextIndex));
        this.updateWorkingTab(this.workingContextIndex, this.lastTabIndex(this.workingContextIndex));
    }

    async openNewTabInNewContext(sharedStorageStateUser?: string) {
        let context: BrowserContext;
        if (!sharedStorageStateUser) {
            context = await this.workingBrowser.newContext();
        } else {
            const userCredentials = getUserCredentials(sharedStorageStateUser);
            const storageStatePath = `.auth/${sharedStorageStateUser}.json`;
            if (!fs.existsSync(storageStatePath)) {
                await this.saveStorageState(this.workingBrowser, userCredentials.username, userCredentials.password, storageStatePath);
            }
            if (!await this.storageStateIsValid(this.workingBrowser, storageStatePath)) {
                await this.saveStorageState(this.workingBrowser, userCredentials.username, userCredentials.password, storageStatePath);
            }
            context = await this.workingBrowser.newContext({storageState: storageStatePath});
        }
        const newPage = await context.newPage();
        this._errorListener.attachTo(newPage);
        this._tabPageTypeHelper.initializeContextPageTypes();
        this._tabPageTypeHelper.initializeTabPageType(this.lastContextIndex, 0);
        this.updateWorkingTab(this.lastContextIndex, 0);
    }

    async switchWorkingTab(contextIndex: number, tabIndex: number, expectedPageType: PageType) {
        expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThan(this.workingBrowser.contexts().length);
        expect(tabIndex, `Tab [${contextIndex},${tabIndex}] not found`).toBeLessThan(this.workingBrowser.contexts()[contextIndex].pages().length);
        const alreadyWorkingOnTheTab = contextIndex === this.workingContextIndex && tabIndex === this.workingTabIndex;
        expect(alreadyWorkingOnTheTab, `Already working on tab [${contextIndex},${tabIndex}]`).toBeFalsy();
        const actualPageType = this._tabPageTypeHelper.tabPageType(contextIndex, tabIndex);
        expect(actualPageType).toBe(expectedPageType);
        this.updateWorkingTab(contextIndex, tabIndex);
    }

    async closeContext(contextIndex: number) {
        expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThan(this.workingBrowser.contexts().length);
        expect(contextIndex, `Context [${contextIndex}] is the Working Context. It cannot be closed`).not.toEqual(this.workingContextIndex);
        this.workingBrowser.contexts()[contextIndex].pages().forEach(async (page) => await page.close());
        await expect(async () => expect(this.workingBrowser.contexts()[contextIndex].pages().length).toEqual(0)).toPass();
        await this.workingBrowser.contexts()[contextIndex].close();
        this._tabPageTypeHelper.removeContextPageTypes(contextIndex);
    }

    async closeTab(contextIndex: number, tabIndex: number) {
        expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThan(this.workingBrowser.contexts().length);
        expect(tabIndex, `Tab [${contextIndex},${tabIndex}] not found`).toBeLessThan(this.workingBrowser.contexts()[contextIndex].pages().length);
        const attemptingToCloseWorkingTab = contextIndex === this.workingContextIndex && tabIndex === this.workingTabIndex;
        expect(attemptingToCloseWorkingTab, `Tab [${contextIndex},${tabIndex}] is the Working Tab. It cannot be closed`).toBeFalsy();
        await this.workingBrowser.contexts()[contextIndex].pages()[tabIndex].close();
        this._tabPageTypeHelper.removeContextPageTypes(contextIndex);
    }

    async closeAllContexts() {
        this.workingBrowser.contexts().forEach(async context => {
            context.pages().forEach(async (page) => await page.close());
            await expect(async () => expect(context.pages().length).toEqual(0)).toPass();
            await context.close();
        });
        await expect(async () => expect(this.workingBrowser.contexts().length).toEqual(0)).toPass();
    }

    async closeBrowser() {
        await this.closeAllContexts();
        await this.workingBrowser.close();
    }
    
    async saveStorageState(browser: Browser, username: string, password: string, storageStatePath: string) {
        if (!this.sharedStorageState.authentication)
            throw new Error("authenticationEndpoint is undefined");
        const context = await browser.newContext();
        await context.request.post(this.sharedStorageState.authentication, {
            data: {
                username: username,
                password: password
            }
        });
        await context.request.storageState({ path: storageStatePath});
        await context.close();
        console.log(`Created ${storageStatePath}`);
    }
    
    async storageStateIsValid(browser: Browser, storageStatePath: string) {
        if (!this.sharedStorageState.validation)
            throw new Error("validationEndpoint is undefined");
        const tokenValue = JSON.parse(fs.readFileSync(storageStatePath).toString())["cookies"][0].value;
        const loggedInContext = await browser.newContext({ storageState: storageStatePath });
        const response = await loggedInContext.request.post(this.sharedStorageState.validation, {
            data: {
                token: tokenValue
            }
        });
        await loggedInContext.close();
        console.log(`Verified ${storageStatePath} is ${response.ok() ? "valid" : "invalid"}`);
        return response.ok();
    }
}