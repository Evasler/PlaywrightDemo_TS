import { expect, Page } from "@playwright/test";
import { PageType } from "../../customTypes/frameworkTypes";
import stepSequenceHelper from "../chaining/stepSequenceHelper";
import frameworkDataHelper from "../data/frameworkDataHelper";
import errorListener from "../../listeners/errorListener";
import storageStateHelper from "../chaining/storageStateHelper";
import tabDataHelper from "../data/tabDataHelper";

let workingTab: Page;

/**
 * The focused Tab's Context.
 */
function workingContext() {
    return workingTab.context();
}

/**
 * The index of the focused Tab's Context.
 */
function workingContextIndex() {
    return frameworkDataHelper.browser.contexts().indexOf(workingContext());
}

/**
 * The index of the focused Tab.
 */
function workingTabIndex() {
    return workingContext().pages().indexOf(workingTab);
}

/**
 * The index of the latest Context in the browser.
 */
function latestContextIndex() {
    return frameworkDataHelper.browser.contexts().length - 1;
}

/**
 * @param contextIndex 
 * @returns The index of the latest Tab in the Context.
 */
function latestTabIndex(contextIndex: number) {
    return frameworkDataHelper.browser.contexts()[contextIndex].pages().length - 1;
}

/**
 * Sets the focused Tab.
 * @param contextIndex 
 * @param tabIndex 
 */
function updateWorkingTab(contextIndex: number, tabIndex: number) {
    workingTab = frameworkDataHelper.browser.contexts()[contextIndex].pages()[tabIndex];
}

/**
 * Manages all actions related to the Browser, Contexts and Tabs.
 * Holds a reference to the focused tab.
 */
const browserHelper = {

    /**
     * The focused Tab.
     */
    get workingTab() {
        return workingTab;
    },

    /**
     * Opens a new Tab in the Context of the focused Tab's Context. The new Tab is focused.
     */
    openNewTabInCurrentContext() {
        stepSequenceHelper.addStep("openNewTabInCurrentContext", async() => {
            console.log("openNewTabInCurrentContext");
            const newPage = await workingContext().newPage();
            errorListener.attachTo(newPage);
            tabDataHelper.initializePageType(workingContextIndex(), latestTabIndex(workingContextIndex()));
            updateWorkingTab(workingContextIndex(), latestTabIndex(workingContextIndex()));
        });
    },

    /**
     * Opens a new Tab in a new Context. The new Tab is focused.
     * @param authenticatedUser Allows avoiding the login process, by loading the user's storageState file in the Context. 
     */
    openNewTabInNewContext(authenticatedUser?: string) {
        stepSequenceHelper.addStep("openNewTabInNewContext", async() => {
            console.log("openNewTabInNewContext");
            let newContext = await frameworkDataHelper.browser.newContext({ storageState: storageStateHelper.storageStatePath(authenticatedUser) });
            let newTab = await newContext.newPage();
            if (authenticatedUser) {
                const generatedFile = await storageStateHelper.createStorageStateFileIfNeededViaAPI(newContext.request, authenticatedUser);
                if (generatedFile) {
                    await newTab.close();
                    await newContext.close();
                    newContext = await frameworkDataHelper.browser.newContext({ storageState: storageStateHelper.storageStatePath(authenticatedUser) });
                    newTab = await newContext.newPage();
                }
            }
            errorListener.attachTo(newTab);
            tabDataHelper.initializeContextPageTypes();
            tabDataHelper.initializePageType(latestContextIndex(), 0);
            updateWorkingTab(latestContextIndex(), 0);
        });
    },

    /**
     * Verifies the target Tab's pageType and sets the focused Tab.
     * @param contextIndex 
     * @param tabIndex 
     * @param expectedPageType 
     */
    switchWorkingTab(contextIndex: number, tabIndex: number, expectedPageType: PageType) {
        stepSequenceHelper.addStep("switchWorkingTab", async() => {
            console.log("switchWorkingTab");
            expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThanOrEqual(latestContextIndex());
            expect(tabIndex, `Tab [${contextIndex},${tabIndex}] not found`).toBeLessThanOrEqual(latestTabIndex(contextIndex));
            const alreadyWorkingOnTheTab = contextIndex === workingContextIndex() && tabIndex === workingTabIndex();
            expect(alreadyWorkingOnTheTab, `Already working on tab [${contextIndex},${tabIndex}]`).toBeFalsy();
            const actualPageType = tabDataHelper.pageType(contextIndex, tabIndex);
            expect(actualPageType).toBe(expectedPageType);
            updateWorkingTab(contextIndex, tabIndex);
        });
    },

    /**
     * Gracefully closes the Context.
     * @param contextIndex 
     */
    closeContext(contextIndex: number) {
        stepSequenceHelper.addStep("closeContext", async() => {
            console.log("closeContext");
            expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThanOrEqual(latestContextIndex());
            expect(contextIndex, `Context [${contextIndex}] is the Working Context. It cannot be closed`).not.toEqual(workingContextIndex());
            frameworkDataHelper.browser.contexts()[contextIndex].pages().forEach(async (page) => await page.close());
            await expect(async () => expect(latestTabIndex(contextIndex)).toEqual(-1)).toPass();
            await frameworkDataHelper.browser.contexts()[contextIndex].close();
            tabDataHelper.removeContextPageTypes(contextIndex);
        });
    },

    /**
     * Closes the Tab.
     * @param contextIndex 
     * @param tabIndex 
     */
    closeTab(contextIndex: number, tabIndex: number) {
        stepSequenceHelper.addStep("closeTab", async() => {
            console.log("closeTab");
            expect(contextIndex, `Context [${contextIndex}] not found`).toBeLessThanOrEqual(latestContextIndex());
            expect(tabIndex, `Tab [${contextIndex},${tabIndex}] not found`).toBeLessThanOrEqual(latestTabIndex(contextIndex));
            const attemptingToCloseWorkingTab = contextIndex === workingContextIndex() && tabIndex === workingTabIndex();
            expect(attemptingToCloseWorkingTab, `Tab [${contextIndex},${tabIndex}] is the Working Tab. It cannot be closed`).toBeFalsy();
            await frameworkDataHelper.browser.contexts()[contextIndex].pages()[tabIndex].close();
            tabDataHelper.removeContextPageTypes(contextIndex);
        });
    },

    /**
     * Gracefully closes all Contexts.
     */
    async closeAllContexts() {
        frameworkDataHelper.browser.contexts().forEach(async context => {
            context.pages().forEach(async (page) => await page.close());
            await expect(async () => expect(context.pages().length).toEqual(0)).toPass();
            await context.close();
        });
        await expect(async () => expect(latestContextIndex()).toEqual(-1)).toPass();
    },

    /**
     * Gracefully closes the Browser.
     */
    async closeBrowser() {
        await this.closeAllContexts();
        await frameworkDataHelper.browser.close();
    }
}

export default browserHelper;