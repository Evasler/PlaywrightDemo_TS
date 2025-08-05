import { type Page, expect } from "@playwright/test";
import type { Component } from "../../types/index.js";
import errorListener from "../../listeners/errorListener.js";
import frameworkDataHelper from "../data/frameworkDataHelper.js";
import stepSequenceHelper from "../chaining/stepSequenceHelper.js";
import tabDataHelper from "../data/tabDataHelper.js";
import storageStateHelper from "../chaining/storageStateHelper.js";

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
  return (
    frameworkDataHelper.browser.contexts()[contextIndex].pages().length - 1
  );
}

/**
 * Sets the focused Tab.
 * @param contextIndex
 * @param tabIndex
 */
function updateWorkingTab(contextIndex: number, tabIndex: number) {
  workingTab = frameworkDataHelper.browser.contexts()[contextIndex].pages()[
    tabIndex
  ];
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
    stepSequenceHelper.addStep(
      "Opening new Tab in current Context",
      async () => {
        console.log("Opening new Tab in current Context");
        const newPage = await workingContext().newPage();
        errorListener.attachTo(newPage);
        tabDataHelper.initializeComponent(
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
   * Opens a new Tab in a new Context. The new Tab is focused.
   * @param authenticatedUser Allows avoiding the login process, by loading the user's storageState file in the Context.
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
      tabDataHelper.initializeContextComponents();
      tabDataHelper.initializeComponent(latestContextIndex(), 0);
      updateWorkingTab(latestContextIndex(), 0);
    });
  },

  /**
   * Verifies the target Tab's pageType and sets the focused Tab.
   * @param contextIndex
   * @param tabIndex
   * @param currentComponent
   * @param nextComponent
   */
  switchWorkingTab(
    contextIndex: number,
    tabIndex: number,
    currentComponent: Component,
    nextComponent: Component,
  ) {
    stepSequenceHelper.addStep(
      `Switching working Tab to [${contextIndex},${tabIndex}] and verifying Component is ${nextComponent}`,
      () => {
        console.log(
          `Switching working Tab to [${contextIndex},${tabIndex}] and verifying Component is ${nextComponent}`,
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
        const actualPageType = tabDataHelper.component(contextIndex, tabIndex);
        expect(actualPageType).toBe(nextComponent);
        tabDataHelper.updateComponent(
          workingContextIndex(),
          workingTabIndex(),
          currentComponent,
        );
        updateWorkingTab(contextIndex, tabIndex);
      },
    );
  },

  /**
   * Gracefully closes the Context.
   * @param contextIndex
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
        tabDataHelper.removeContextComponents(contextIndex);
      },
    );
  },

  /**
   * Closes the Tab.
   * @param contextIndex
   * @param tabIndex
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
        tabDataHelper.removeContextComponents(contextIndex);
      },
    );
  },

  /**
   * Gracefully closes all Contexts.
   */
  async closeAllContexts() {
    for (const context of frameworkDataHelper.browser.contexts()) {
      for (const page of context.pages()) await page.close();
      await context.close();
    }
  },

  /**
   * Gracefully closes the Browser.
   */
  async closeBrowser() {
    await this.closeAllContexts();
    await frameworkDataHelper.browser.close();
  },
};

export default browserHelper;
