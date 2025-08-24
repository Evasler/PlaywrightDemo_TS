/**
 * @description This module provides a mechanism for storing and retrieving test data
 * across different test steps. It enables data sharing between test step methods,
 * allowing for cleaner test files.
 */

import type { TestDataKeys } from "../../types/index.js";

/**
 * Map that stores test data values organized by keys.
 * Each key maps to an array of string values that can be accessed by index.
 */
const testData = new Map<TestDataKeys, string[]>();

/**
 * Helper module for managing test data across test steps.
 *
 * This module provides functionality to store, retrieve, and reset test data during test execution.
 * It enables data sharing between test step methods, allowing for cleaner test files.
 */
const testDataHelper = {
  /**
   * Stores a value in the array of values for the specified key.
   *
   * If the key doesn't exist yet, it creates a new array for that key.
   * Each subsequent value is appended to the end of the array.
   *
   * @param key - The category of test data to store the value under
   * @param value - The string value to store
   */
  pushTestData(key: TestDataKeys, value: string) {
    let values = testData.get(key);
    if (!values) {
      values = [];
      testData.set(key, values);
    }
    values.push(value);
  },

  /**
   * Retrieves a value from the array of values for the specified key.
   *
   * @param key - The category of test data to retrieve from
   * @param index - The index of the value to retrieve
   * @returns The stored string value at the specified index
   * @throws Error if the key doesn't exist, or the index is out of bounds
   */
  getTestData(key: TestDataKeys, index: number) {
    const values = testData.get(key);
    if (!values || index < 0 || index >= values.length)
      throw new Error(`No test data found for "${key}" at "${index}"`);
    return values[index];
  },

  /**
   * Resets all test data by clearing the internal Map.
   *
   * This method is typically called before each test to ensure
   * data from previous tests doesn't affect the current test.
   */
  resetTestData() {
    testData.clear();
  },
};

export default testDataHelper;
