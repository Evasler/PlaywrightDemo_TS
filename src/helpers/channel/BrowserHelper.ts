import { Browser, expect, Page } from "@playwright/test";
import { PageType } from "../../customTypes/FrameworkTypes";
import { ErrorListenerOptions } from "../../customTypes/FrameworkTypes";
import TabPageTypeHelper from "../chaining/TabPageTypeHelper";
import ErrorListener from "../../listeners/ErrorListener";
import StorageStateHelper from "../chaining/StorageStateHelper";
import StepSequenceHelper from "../chaining/StepSequenceHelper";

/**
 * Manages all actions related to the Browser, Contexts and Tabs.
 * Holds a reference to the focused tab.
 */
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

    /**
     * The focused Tab's Context.
     */
    private get _workingContext() {
        return this.workingTab.context();
    }
    
    /**
     * The focused Tab.
     */
    get workingTab() {
        return this._workingTab;
    }

    /**
     * The index of the focused Tab's Context.
     */
    private get _workingContextIndex() {
        return this._workingBrowser.contexts().indexOf(this._workingContext);
    }

    /**
     * The index of the focused Tab.
     */
    private get _workingTabIndex() {
        return this._workingContext.pages().indexOf(this.workingTab);
    }
    
    /**
     * The index of the latest Context in the browser.
     */
    private get _latestContextIndex() {
        return this._workingBrowser.contexts().length - 1;
    }

    /**
     * @param contextIndex 
     * @returns The index of the latest Tab in the Context.
     */
    private _latestTabIndex(contextIndex: number) {
        return this._workingBrowser.contexts()[contextIndex].pages().length - 1;
    }

    /**
     * Sets the focused Tab.
     * @param contextIndex 
     * @param tabIndex 
     */
    private _updateWorkingTab(contextIndex: number, tabIndex: number) {
        this._workingTab = this._workingBrowser.contexts()[contextIndex].pages()[tabIndex];
    }

    /**
     * Opens a new Tab in the Context of the focused Tab's Context. The new Tab is focused.
     */
    openNewTabInCurrentContext() {
        this._stepSequenceHelper.addStep("openNewTabInCurrentContext", async() => {
            console.log("openNewTabInCurrentContext");
            const newPage = await this._workingContext.newPage();
            this._errorListener.attachTo(newPage);
            this._tabPageTypeHelper.initializeTabPageType(this._workingContextIndex, this._latestTabIndex(this._workingContextIndex));
            this._updateWorkingTab(this._workingContextIndex, this._latestTabIndex(this._workingContextIndex));
        });
    }

    /**
     * Opens a new Tab in a new Context. The new Tab is focused.
     * @param authenticatedUser Allows avoiding the login process, by loading the user's storageState file in the Context. 
     */
    openNewTabInNewContext(authenticatedUser?: string) {
        this._stepSequenceHelper.addStep("openNewTabInNewContext", async() => {
            console.log("openNewTabInNewContext");
            let newContext = await this._workingBrowser.newContext({ storageState: this._storageStateHelper.storageStateValue(authenticatedUser) });
            let newTab = await newContext.newPage();
            if (authenticatedUser) {
                const generatedFile = await this._storageStateHelper.createStorageStateFileIfNeededViaAPI(newContext.request, authenticatedUser);
                if (generatedFile) {
                    await newTab.close();
                    await newContext.close();
                    newContext = await this._workingBrowser.newContext({ storageState: this._storageStateHelper.storageStateValue(authenticatedUser) });
                    newTab = await newContext.newPage();
                }
            }
            this._errorListener.attachTo(newTab);
            this._tabPageTypeHelper.initializeContextPageTypes();
            this._tabPageTypeHelper.initializeTabPageType(this._latestContextIndex, 0);
            this._updateWorkingTab(this._latestContextIndex, 0);
        });
    }

    /**
     * Verifies the target Tab's pageType and sets the focused Tab.
     * @param contextIndex 
     * @param tabIndex 
     * @param expectedPageType 
     */
    switchWorkingTab(contextIndex: number, tabIndex: number, expectedPageType: PageType) {
        this._stepSequenceHelper.addStep("switchWorkingTab", async() => {
            console.log("switchWorkingTab");
            expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThanOrEqual(this._latestContextIndex);
            expect(tabIndex, `Tab [${contextIndex},${tabIndex}] not found`).toBeLessThanOrEqual(this._latestTabIndex(contextIndex));
            const alreadyWorkingOnTheTab = contextIndex === this._workingContextIndex && tabIndex === this._workingTabIndex;
            expect(alreadyWorkingOnTheTab, `Already working on tab [${contextIndex},${tabIndex}]`).toBeFalsy();
            const actualPageType = this._tabPageTypeHelper.tabPageType(contextIndex, tabIndex);
            expect(actualPageType).toBe(expectedPageType);
            this._updateWorkingTab(contextIndex, tabIndex);
        });
    }

    /**
     * Gracefully closes the Context.
     * @param contextIndex 
     */
    closeContext(contextIndex: number) {
        this._stepSequenceHelper.addStep("closeContext", async() => {
            console.log("closeContext");
            expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThanOrEqual(this._latestContextIndex);
            expect(contextIndex, `Context [${contextIndex}] is the Working Context. It cannot be closed`).not.toEqual(this._workingContextIndex);
            this._workingBrowser.contexts()[contextIndex].pages().forEach(async (page) => await page.close());
            await expect(async () => expect(this._latestTabIndex(contextIndex)).toEqual(-1)).toPass();
            await this._workingBrowser.contexts()[contextIndex].close();
            this._tabPageTypeHelper.removeContextPageTypes(contextIndex);
        });
    }

    /**
     * Closes the Tab.
     * @param contextIndex 
     * @param tabIndex 
     */
    closeTab(contextIndex: number, tabIndex: number) {
        this._stepSequenceHelper.addStep("closeTab", async() => {
            console.log("closeTab");
            expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThanOrEqual(this._latestContextIndex);
            expect(tabIndex, `Tab [${contextIndex},${tabIndex}] not found`).toBeLessThanOrEqual(this._latestTabIndex(contextIndex));
            const attemptingToCloseWorkingTab = contextIndex === this._workingContextIndex && tabIndex === this._workingTabIndex;
            expect(attemptingToCloseWorkingTab, `Tab [${contextIndex},${tabIndex}] is the Working Tab. It cannot be closed`).toBeFalsy();
            await this._workingBrowser.contexts()[contextIndex].pages()[tabIndex].close();
            this._tabPageTypeHelper.removeContextPageTypes(contextIndex);
        });
    }

    /**
     * Gracefully closes all Contexts.
     */
    async closeAllContexts() {
        this._workingBrowser.contexts().forEach(async context => {
            context.pages().forEach(async (page) => await page.close());
            await expect(async () => expect(context.pages().length).toEqual(0)).toPass();
            await context.close();
        });
        await expect(async () => expect(this._latestContextIndex).toEqual(-1)).toPass();
    }

    /**
     * Gracefully closes the Browser.
     */
    async closeBrowser() {
        await this.closeAllContexts();
        await this._workingBrowser.close();
    }
}