/**
 * @description This module provides a mechanism for tracking page types across browser tabs
 * in Playwright tests. It maintains a data structure that records which page type is
 * loaded in each browser tab across multiple browser contexts, facilitating validation during
 * tab switching operations.
 */

import type { PageType } from "../../types/index.js";

/** Default page type for newly created browser tabs */
const initialPageType: PageType = "Blank";

/** Multi-dimensional array storing page types for all tabs in all contexts */
const pageTypes: PageType[][] = [];

/**
 * Helper module for managing page type tracking across browser tabs.
 *
 * This module maintains a record of which page type is loaded in each browser tab,
 * allowing tests to validate that tab switching operations are targeting the correct
 * page types. It provides a clean interface for tracking page state across
 * multiple browser contexts and tabs, enhancing error messages when tabs contain
 * unexpected content.
 */
const tabDataHelper = {
  /**
   * Retrieves the page type of a specific tab
   *
   * @param contextIndex - The index of the browser context
   * @param tabIndex - The index of the tab within the context
   * @returns The page type loaded in the specified tab
   */
  pageType(contextIndex: number, tabIndex: number) {
    return pageTypes[contextIndex][tabIndex];
  },

  /**
   * Initializes the array of page types for a new browser context
   *
   * This method is called when a new browser context is created to prepare
   * for tracking page types within that context.
   */
  initializeContextPageTypes() {
    pageTypes.push(new Array<PageType>());
  },

  /**
   * Sets the initial default page type for a newly created tab
   *
   * @param contextIndex - The index of the browser context
   * @param tabIndex - The index of the tab within the context
   */
  initializePageType(contextIndex: number, tabIndex: number) {
    this.updatePageType(contextIndex, tabIndex, initialPageType);
  },

  /**
   * Removes page type tracking for an entire browser context
   *
   * This method is called when a browser context is closed to clean up
   * the tracking data for that context.
   *
   * @param contextIndex - The index of the browser context to remove
   */
  removeContextPageTypes(contextIndex: number) {
    pageTypes.splice(contextIndex, 1);
  },

  /**
   * Updates the page type of a specific tab
   *
   * @param contextIndex - The index of the browser context
   * @param tabIndex - The index of the tab within the context
   * @param pageType - The new page type to set for the tab
   */
  updatePageType(contextIndex: number, tabIndex: number, pageType: PageType) {
    pageTypes[contextIndex][tabIndex] = pageType;
  },

  /**
   * Resets all page type tracking data
   *
   * This method clears all page type tracking information across all contexts and tabs.
   * It's typically called at the start of a test to ensure a clean state.
   */
  resetPageTypes() {
    pageTypes.length = 0;
  },
};

export default tabDataHelper;
