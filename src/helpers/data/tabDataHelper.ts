/**
 * @description This module provides a mechanism for tracking component types across browser tabs
 * in Playwright tests. It maintains a data structure that records which component type is
 * loaded in each browser tab across multiple browser contexts, facilitating validation during
 * tab switching operations.
 */

import type { ComponentType } from "../../types/index.js";

/** Default component type for newly created browser tabs */
const initialComponentType: ComponentType = "Blank";

/** Multi-dimensional array storing component types for all tabs in all contexts */
const componentTypes: ComponentType[][] = [];

/**
 * Helper module for managing component type tracking across browser tabs.
 *
 * This module maintains a record of which component type is loaded in each browser tab,
 * allowing tests to validate that tab switching operations are targeting the correct
 * component types. It provides a clean interface for tracking component state across
 * multiple browser contexts and tabs, enhancing error messages when tabs contain
 * unexpected content.
 */
const tabDataHelper = {
  /**
   * Retrieves the component type of a specific tab
   *
   * @param contextIndex - The index of the browser context
   * @param tabIndex - The index of the tab within the context
   * @returns The component type loaded in the specified tab
   */
  componentType(contextIndex: number, tabIndex: number) {
    return componentTypes[contextIndex][tabIndex];
  },

  /**
   * Initializes the array of component types for a new browser context
   *
   * This method is called when a new browser context is created to prepare
   * for tracking component types within that context.
   */
  initializeContextComponentTypes() {
    componentTypes.push(new Array<ComponentType>());
  },

  /**
   * Sets the initial default component type for a newly created tab
   *
   * @param contextIndex - The index of the browser context
   * @param tabIndex - The index of the tab within the context
   */
  initializeComponentType(contextIndex: number, tabIndex: number) {
    this.updateComponentType(contextIndex, tabIndex, initialComponentType);
  },

  /**
   * Removes component tracking for an entire browser context
   *
   * This method is called when a browser context is closed to clean up
   * the tracking data for that context.
   *
   * @param contextIndex - The index of the browser context to remove
   */
  removeContextComponentTypes(contextIndex: number) {
    componentTypes.splice(contextIndex, 1);
  },

  /**
   * Updates the component type of a specific tab
   *
   * @param contextIndex - The index of the browser context
   * @param tabIndex - The index of the tab within the context
   * @param component - The new component type to set for the tab
   */
  updateComponentType(
    contextIndex: number,
    tabIndex: number,
    component: ComponentType,
  ) {
    componentTypes[contextIndex][tabIndex] = component;
  },

  /**
   * Resets all component type tracking data
   *
   * This method clears all component type tracking information across all contexts and tabs.
   * It's typically called at the start of a test to ensure a clean state.
   */
  resetComponentTypes() {
    componentTypes.length = 0;
  },
};

export default tabDataHelper;
