/**
 * @description This module provides functionality for managing browser automation in Playwright tests.
 * It handles browser contexts and tabs (pages).
 * The module maintains a concept of "working tab" which represents the currently focused browser tab.
 */

import { type Page, expect } from "@playwright/test";
import type { PageType } from "../../types/index.js";
import errorListener from "../../listeners/errorListener.js";
import frameworkDataHelper from "../data/frameworkDataHelper.js";
import stepSequenceHelper from "../chaining/stepSequenceHelper.js";
import tabDataHelper from "../data/tabDataHelper.js";
import storageStateHelper from "../chaining/storageStateHelper.js";

/** The currently focused browser tab */
let workingTab: Page;

/**
 * @returns The browser context of the currently focused tab
 */
function workingContext() {
  return workingTab.context();
}

/**
 * @returns The index of the working context
 */
function workingContextIndex() {
  return frameworkDataHelper.browser.contexts().indexOf(workingContext());
}

/**
 * @returns The index of the working tab within its context
 */
function workingTabIndex() {
  return workingContext().pages().indexOf(workingTab);
}

/**
 * @returns The index of the most recently created browser context
 */
function latestContextIndex() {
  return frameworkDataHelper.browser.contexts().length - 1;
}

/**
 * @param contextIndex - The index of the context to check
 * @returns The index of the most recently created tab in a specific context
 */
function latestTabIndex(contextIndex: number) {
  return (
    frameworkDataHelper.browser.contexts()[contextIndex].pages().length - 1
  );
}

/**
 * Updates the working tab reference to point to a specific tab
 *
 * @param contextIndex - The index of the context containing the tab
 * @param tabIndex - The index of the tab within its context
 */
function updateWorkingTab(contextIndex: number, tabIndex: number) {
  workingTab = frameworkDataHelper.browser.contexts()[contextIndex].pages()[
    tabIndex
  ];
}

/**
 * Helper module for managing browser context and tab operations.
 *
 * This helper maintains the concept of a "working tab" which is the currently focused tab
 * that subsequent operations will act upon. It provides a fluent pattern for browser automation
 * with proper error handling and validation.
 */
const browserHelper = {
  /**
   * @returns The currently focused tab in the browser
   */
  get workingTab() {
    return workingTab;
  },

  /**
   * Opens a new tab in the current browser context and sets it as the working tab
   *
   * This method:
   * - Creates a new page in the same context as the current working tab
   * - Attaches the error listener to the new page
   * - Initializes page type for the new tab
   * - Sets the new tab as the working tab
   */
  openNewTabInCurrentContext() {
    stepSequenceHelper.addStep(
      "Opening new Tab in current Context",
      async () => {
        console.log("Opening new Tab in current Context");
        const newPage = await workingContext().newPage();
        errorListener.attachTo(newPage);
        tabDataHelper.initializePageType(
          workingContextIndex(),
          latestTabIndex(workingContextIndex()),
        );
        updateWorkingTab(
          workingContextIndex(),
          latestTabIndex(workingContextIndex()),
        );
      },
    );
  },

  /**
   * Opens a new tab in a new browser context and sets it as the working tab
   *
   * This method:
   * - Creates a new browser context
   * - Creates a new page within that context
   * - Optionally applies authentication state for a specific user
   * - Regenerates storage state via API if needed
   * - Attaches error listener to the new page
   * - Initializes page type for the new context and tab
   * - Sets the new tab as the working tab
   *
   * @param authenticatedUser Optional username to load storage state for,
   * allowing tests to skip login processes
   */
  openNewTabInNewContext(authenticatedUser?: string) {
    stepSequenceHelper.addStep("Opening new Tab in new Context", async () => {
      console.log("Opening new Tab in new Context");
      let newContext = await frameworkDataHelper.browser.newContext({
        storageState: storageStateHelper.storageStatePath(authenticatedUser),
      });
      let newTab = await newContext.newPage();
      if (authenticatedUser) {
        const generatedFile =
          await storageStateHelper.createStorageStateFileIfNeededViaAPI(
            newContext.request,
            authenticatedUser,
          );
        if (generatedFile) {
          await newTab.close();
          await newContext.close();
          newContext = await frameworkDataHelper.browser.newContext({
            storageState:
              storageStateHelper.storageStatePath(authenticatedUser),
          });
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
   * Switches the working tab to a different tab and performs page type validation
   *
   * This method:
   * - Verifies the target context and tab indices are valid
   * - Ensures we're not already on the requested tab
   * - Verifies the target tab has the expected page type
   * - Updates the page type of the previous working tab
   * - Sets the target tab as the working tab
   *
   * @param contextIndex - The index of the target context
   * @param tabIndex - The index of the target tab within its context
   * @param currentPageType - Page type to set on the current working tab before switching
   * @param nextPageType - Expected page type of the target tab
   * @throws Will throw an error if target indices are invalid or page type doesn't match
   */
  switchWorkingTab(
    contextIndex: number,
    tabIndex: number,
    currentPageType: PageType,
    nextPageType: PageType,
  ) {
    stepSequenceHelper.addStep(
      `Switching working Tab to [${contextIndex},${tabIndex}] and verifying Page is ${nextPageType}`,
      () => {
        console.log(
          `Switching working Tab to [${contextIndex},${tabIndex}] and verifying Page is ${nextPageType}`,
        );
        expect(
          contextIndex,
          `Context [${contextIndex}] not found`,
        ).toBeLessThanOrEqual(latestContextIndex());
        expect(
          tabIndex,
          `Tab [${contextIndex},${tabIndex}] not found`,
        ).toBeLessThanOrEqual(latestTabIndex(contextIndex));
        const alreadyWorkingOnTheTab =
          contextIndex === workingContextIndex() &&
          tabIndex === workingTabIndex();
        expect(
          alreadyWorkingOnTheTab,
          `Already working on tab [${contextIndex},${tabIndex}]`,
        ).toBeFalsy();
        const actualPageType = tabDataHelper.pageType(contextIndex, tabIndex);
        expect(actualPageType).toBe(nextPageType);
        tabDataHelper.updatePageType(
          workingContextIndex(),
          workingTabIndex(),
          currentPageType,
        );
        updateWorkingTab(contextIndex, tabIndex);
      },
    );
  },

  /**
   * Gracefully closes a browser context and all its tabs
   *
   * This method:
   * - Validates the target context index
   * - Ensures we're not trying to close the working context
   * - Closes all pages in the context
   * - Closes the context itself
   * - Updates tracking data to reflect the changes
   *
   * @param contextIndex - The index of the context to close
   * @throws Will throw an error if trying to close an invalid context or the working context
   */
  closeContext(contextIndex: number) {
    stepSequenceHelper.addStep(
      `Closing Context [${contextIndex}]`,
      async () => {
        console.log(`Closing Context [${contextIndex}]`);
        expect(
          contextIndex,
          `Context [${contextIndex}] not found`,
        ).toBeLessThanOrEqual(latestContextIndex());
        expect(
          contextIndex,
          `Context [${contextIndex}] is the Working Context. It cannot be closed`,
        ).not.toEqual(workingContextIndex());
        for (const page of frameworkDataHelper.browser
          .contexts()
          [contextIndex].pages())
          await page.close();
        await frameworkDataHelper.browser.contexts()[contextIndex].close();
        tabDataHelper.removeContextPageTypes(contextIndex);
      },
    );
  },

  /**
   * Closes a specific tab in a browser context
   *
   * This method:
   * - Validates the target context and tab indices
   * - Ensures we're not trying to close the working tab
   * - Closes the specified tab
   * - Updates tracking data to reflect the changes
   *
   * @param contextIndex - The index of the context containing the tab
   * @param tabIndex - The index of the tab to close
   * @throws Will throw an error if trying to close an invalid tab or the working tab
   */
  closeTab(contextIndex: number, tabIndex: number) {
    stepSequenceHelper.addStep(
      `Closing Tab [${contextIndex},${tabIndex}]`,
      async () => {
        console.log(`Closing Tab [${contextIndex},${tabIndex}]`);
        expect(
          contextIndex,
          `Context [${contextIndex}] not found`,
        ).toBeLessThanOrEqual(latestContextIndex());
        expect(
          tabIndex,
          `Tab [${contextIndex},${tabIndex}] not found`,
        ).toBeLessThanOrEqual(latestTabIndex(contextIndex));
        const attemptingToCloseWorkingTab =
          contextIndex === workingContextIndex() &&
          tabIndex === workingTabIndex();
        expect(
          attemptingToCloseWorkingTab,
          `Tab [${contextIndex},${tabIndex}] is the Working Tab. It cannot be closed`,
        ).toBeFalsy();
        await frameworkDataHelper.browser
          .contexts()
          [contextIndex].pages()
          [tabIndex].close();
        tabDataHelper.removeContextPageTypes(contextIndex);
      },
    );
  },

  /**
   * Gracefully closes all browser contexts and their tabs
   *
   * This method iterates through all browser contexts, closes all their pages,
   * and then closes the contexts themselves. This provides a clean way to reset
   * the browser state.
   */
  async closeAllContexts() {
    for (const context of frameworkDataHelper.browser.contexts()) {
      for (const page of context.pages()) await page.close();
      await context.close();
    }
  },

  /**
   * Completely closes the browser instance
   *
   * This method closes all contexts first using closeAllContexts() and then
   * closes the browser itself, releasing all resources.
   */
  async closeBrowser() {
    await this.closeAllContexts();
    await frameworkDataHelper.browser.close();
  },
};

export default browserHelper;
