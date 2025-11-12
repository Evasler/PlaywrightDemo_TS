/**
 * @description This module provides a mechanism for chaining test steps in Playwright tests while
 * maintaining readable error stacks. It enables a fluent pattern for test steps, ensuring
 * sequential execution and proper error reporting that points directly to the test file.
 */

import { test } from "@playwright/test";

/**
 * Regular expression that matches stack trace lines pointing to spec files.
 * Uses the testDir from Playwright config and accounts for different path separators.
 */
const testFilePath = /(\\|\/).+.spec.ts:[0-9]+:[0-9]+/;

/**
 * A Promise chain that ensures test steps execute sequentially.
 * This is initialized as a resolved Promise and extended with each test step.
 */
let stepSequence = Promise.resolve();

/**
 * Searches the callstack for a line pointing to a .spec.ts file.
 *
 * @param callStack - The error stack trace as a string
 * @returns The line from the stack trace that points to the spec file
 * @throws Error if no matching line or multiple matching lines are found
 */
function getTestCallRowInStack(callStack: string) {
  const testCallRows = callStack
    .split("\n")
    .filter((row) => testFilePath.test(row));
  if (testCallRows.length === 0)
    throw new Error(`Found 0 rows matching ${testFilePath}`);
  else if (testCallRows.length > 1)
    throw new Error(`Found multiple rows matching ${testFilePath}`);
  return testCallRows[0];
}

/**
 * Helper object that facilitates sequential execution of test steps with improved error reporting.
 *
 * This helper enables method chaining in tests by:
 * 1. Managing a promise chain to ensure steps run in sequence
 * 2. Modifying error stack traces to point to the line containing the failed step,
 * rather than the line containing `await`
 * 3. Providing a clean pattern for adding steps and executing the sequence
 *
 * @example
 * // In a page object file:
 * function doSomething() {
 *   stepSequenceHelper.addStep("Do something", async () => {
 *     // Step implementation
 *   });
 *   return this; // Enable chaining
 * }
 *
 * // In a test file:
 * test("should perform actions in sequence", async () => {
 *   await myPage
 *     .doSomething()
 *     .doSomethingElse()
 *     .andAnother()
 *     ._execute(); // Run the sequence
 * });
 */
const stepSequenceHelper = {
  /**
   * @returns A Promise chain representing the pending test steps
   */
  get stepSequence() {
    return stepSequence;
  },

  /**
   * Resets the step sequence to a resolved Promise.
   *
   * This is necessary when a test is marked with Playwright's `.fail()` flag.
   * When a test fails, the step sequence is a rejected Promise.
   * However, since the expected outcome is `failed`, the worker will be reused for the next test execution.
   * Hence, the added steps will not be executed and the error from the previous test will be propagated.
   */
  resetStepSequence() {
    stepSequence = Promise.resolve();
  },

  /**
   * Adds a new step to the sequence and handles error stack trace modification.
   *
   * When a step fails, the error stack is modified to point to the line containing the failed step,
   * rather than the line containing `await`
   *
   * @param title - The name of the step to display in test reports
   * @param callback - The function to execute as part of this step
   */
  addStep(title: string, callback: () => void | Promise<void>) {
    const myError = new Error();
    const step = async () => {
      await test.step(title, callback);
    };
    stepSequence = stepSequence.then(step).catch((error: unknown) => {
      if (error instanceof Error) {
        if (error.stack && myError.stack)
          if (
            error.stack.includes(import.meta.url) &&
            testFilePath.test(myError.stack)
          ) {
            const stepCallRow = getTestCallRowInStack(myError.stack);
            const promiseAwaitRow = getTestCallRowInStack(error.stack);
            error.stack = error.stack
              .replace(promiseAwaitRow, stepCallRow)
              .split("\n")
              .filter((row) => !row.includes(import.meta.url))
              .join("\n");
          }
        throw error;
      }
    });
  },
};

export default stepSequenceHelper;
