import { Browser, expect, Page } from "@playwright/test";
import { PageType } from "../../customTypes/FrameworkTypes";
import { ErrorListenerOptions } from "../../customTypes/FrameworkTypes";
import TabPageTypeHelper from "./TabPageTypeHelper";
import ErrorListener from "../../listeners/ErrorListener";
import StorageStateHelper from "./StorageStateHelper";
import StepSequenceHelper from "../chaining/StepSequenceHelper";

export default class BrowserHelper {

    private readonly _errorListener: ErrorListener;
    private readonly _tabPageTypeHelper: TabPageTypeHelper;
    private readonly _storageStateHelper: StorageStateHelper;

    private _workingTab!: Page;

    constructor(
        private _workingBrowser: Browser,
        private readonly _stepSequenceHelper: StepSequenceHelper,
        baseUrl: string,
        errorListenerOptions: ErrorListenerOptions
    ) {
        this._errorListener = new ErrorListener(errorListenerOptions);
        this._tabPageTypeHelper = new TabPageTypeHelper();
        this._storageStateHelper = new StorageStateHelper(baseUrl);
    }

    private get _workingContext() {
        return this.workingTab.context();
    }
    
    get workingTab() {
        return this._workingTab;
    }

    private get _workingContextIndex() {
        return this._workingBrowser.contexts().indexOf(this._workingContext);
    }

    private get _workingTabIndex() {
        return this._workingContext.pages().indexOf(this.workingTab);
    }
    
    private get _lastContextIndex() {
        return this._workingBrowser.contexts().length - 1;
    }

    private _lastTabIndex(contextIndex: number) {
        return this._workingBrowser.contexts()[contextIndex].pages().length - 1;
    }

    private _updateWorkingTab(contextIndex: number, tabIndex: number) {
        this._workingTab = this._workingBrowser.contexts()[contextIndex].pages()[tabIndex];
    }

    openNewTabInCurrentContext() {
        this._stepSequenceHelper.addStep("openNewTabInCurrentContext", async() => {
            console.log("openNewTabInCurrentContext");
            const newPage = await this._workingContext.newPage();
            this._errorListener.attachTo(newPage);
            this._tabPageTypeHelper.initializeTabPageType(this._workingContextIndex, this._lastTabIndex(this._workingContextIndex));
            this._updateWorkingTab(this._workingContextIndex, this._lastTabIndex(this._workingContextIndex));
        });
    }

    openNewTabInNewContext(authenticatedUser?: string) {
        this._stepSequenceHelper.addStep("openNewTabInNewContext", async() => {
            console.log("openNewTabInNewContext");
            let newContext = await this._workingBrowser.newContext({ storageState: this._storageStateHelper.storageStateValue(authenticatedUser) });
            let newTab = await newContext.newPage();
            if (authenticatedUser) {
                const generatedFile = await this._storageStateHelper.generateStorageStateFileIfNeededViaAPI(newContext.request, authenticatedUser);
                if (generatedFile) {
                    await newTab.close();
                    await newContext.close();
                    newContext = await this._workingBrowser.newContext({ storageState: this._storageStateHelper.storageStateValue(authenticatedUser) });
                    newTab = await newContext.newPage();
                }
            }
            this._errorListener.attachTo(newTab);
            this._tabPageTypeHelper.initializeContextPageTypes();
            this._tabPageTypeHelper.initializeTabPageType(this._lastContextIndex, 0);
            this._updateWorkingTab(this._lastContextIndex, 0);
        });
    }

    switchWorkingTab(contextIndex: number, tabIndex: number, expectedPageType: PageType) {
        this._stepSequenceHelper.addStep("switchWorkingTab", async() => {
            console.log("switchWorkingTab");
            expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThanOrEqual(this._lastContextIndex);
            expect(tabIndex, `Tab [${contextIndex},${tabIndex}] not found`).toBeLessThanOrEqual(this._lastTabIndex(contextIndex));
            const alreadyWorkingOnTheTab = contextIndex === this._workingContextIndex && tabIndex === this._workingTabIndex;
            expect(alreadyWorkingOnTheTab, `Already working on tab [${contextIndex},${tabIndex}]`).toBeFalsy();
            const actualPageType = this._tabPageTypeHelper.tabPageType(contextIndex, tabIndex);
            expect(actualPageType).toBe(expectedPageType);
            this._updateWorkingTab(contextIndex, tabIndex);
        });
    }

    closeContext(contextIndex: number) {
        this._stepSequenceHelper.addStep("closeContext", async() => {
            console.log("closeContext");
            expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThanOrEqual(this._lastContextIndex);
            expect(contextIndex, `Context [${contextIndex}] is the Working Context. It cannot be closed`).not.toEqual(this._workingContextIndex);
            this._workingBrowser.contexts()[contextIndex].pages().forEach(async (page) => await page.close());
            await expect(async () => expect(this._lastTabIndex(contextIndex)).toEqual(-1)).toPass();
            await this._workingBrowser.contexts()[contextIndex].close();
            this._tabPageTypeHelper.removeContextPageTypes(contextIndex);
        });
    }

    closeTab(contextIndex: number, tabIndex: number) {
        this._stepSequenceHelper.addStep("closeTab", async() => {
            console.log("closeTab");
            expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThanOrEqual(this._lastContextIndex);
            expect(tabIndex, `Tab [${contextIndex},${tabIndex}] not found`).toBeLessThanOrEqual(this._lastTabIndex(contextIndex));
            const attemptingToCloseWorkingTab = contextIndex === this._workingContextIndex && tabIndex === this._workingTabIndex;
            expect(attemptingToCloseWorkingTab, `Tab [${contextIndex},${tabIndex}] is the Working Tab. It cannot be closed`).toBeFalsy();
            await this._workingBrowser.contexts()[contextIndex].pages()[tabIndex].close();
            this._tabPageTypeHelper.removeContextPageTypes(contextIndex);
        });
    }

    async closeAllContexts() {
        this._workingBrowser.contexts().forEach(async context => {
            context.pages().forEach(async (page) => await page.close());
            await expect(async () => expect(context.pages().length).toEqual(0)).toPass();
            await context.close();
        });
        await expect(async () => expect(this._lastContextIndex).toEqual(-1)).toPass();
    }

    async closeBrowser() {
        await this.closeAllContexts();
        await this._workingBrowser.close();
    }
}