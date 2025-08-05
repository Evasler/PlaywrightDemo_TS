import type { Component } from "../../types/index.js";

const initialComponent: Component = "Blank";
const components: Component[][] = [];

/**
 * Stores the Component of each tab for all contexts.
 * Allows providing feedback, in case of erroneous tab-switching, while writting Tests in a method-chaining manner.
 */
const tabDataHelper = {
  /**
   * @param contextIndex
   * @param tabIndex
   * @returns The component of the tab.
   */
  component(contextIndex: number, tabIndex: number) {
    return components[contextIndex][tabIndex];
  },

  /**
   * Initializes the array of components for a new context.
   */
  initializeContextComponents() {
    components.push(new Array<Component>());
  },

  /**
   * Sets initialComponent as the component of the tab.
   * @param contextIndex
   * @param tabIndex
   */
  initializeComponent(contextIndex: number, tabIndex: number) {
    this.updateComponent(contextIndex, tabIndex, initialComponent);
  },

  /**
   * Deletes the context's array of components.
   * @param contextIndex
   */
  removeContextComponents(contextIndex: number) {
    components.splice(contextIndex, 1);
  },

  /**
   * Sets the component of the tab.
   * @param contextIndex
   * @param tabIndex
   * @param component
   */
  updateComponent(
    contextIndex: number,
    tabIndex: number,
    component: Component,
  ) {
    components[contextIndex][tabIndex] = component;
  },

  resetComponents() {
    components.length = 0;
  },
};

export default tabDataHelper;
