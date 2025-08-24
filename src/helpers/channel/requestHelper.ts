/**
 * @description This module provides a helper for managing API request contexts in Playwright tests.
 * It allows creating, switching between, and managing multiple request contexts,
 * along with their associated headers. The module maintains two types of contexts:
 * 1. Persistent contexts - Can be created and switched between during test execution
 * 2. Throw-away contexts - Created for one-time use and cannot be focused again
 *
 * Each context can have its own set of extra headers that will be applied to requests.
 */

import { type APIRequestContext, test, expect } from "@playwright/test";
import frameworkDataHelper from "../data/frameworkDataHelper.js";
import storageStateHelper from "../chaining/storageStateHelper.js";

const requestContexts: APIRequestContext[] = [];
const throwAwayContexts: APIRequestContext[] = [];
const requestContextsExtraHeaders: (undefined | Map<string, string>)[] = [];
const throwAwayContextsExtraHeaders: (undefined | Map<string, string>)[] = [];

let workingRequestContext: APIRequestContext;

/**
 * Sets the focused Request Context.
 * @param requestContextIndex - The index of the context to set as focused
 */
function updateWorkingRequestContext(requestContextIndex: number) {
  workingRequestContext = requestContexts[requestContextIndex];
}

/**
 * Helper module for managing API Request context operations.
 */
const requestHelper = {
  /**
   * @returns The focused request context
   */
  get workingRequestContext() {
    return workingRequestContext;
  },

  /**
   * @returns The index of the focused request context in the requestContexts array,
   * or -1 if the focused context is a throw-away context
   */
  get workingRequestContextIndex() {
    return requestContexts.indexOf(workingRequestContext);
  },

  /**
   * Adds or updates a custom header for the currently focused request context.
   * The header will be available for all subsequent requests made with this context.
   *
   * @param key - The header name
   * @param value - The header value
   */
  putExtraHeader(key: string, value: string) {
    const contextIndex = requestContexts.indexOf(workingRequestContext);
    if (contextIndex >= 0) {
      requestContextsExtraHeaders[contextIndex] ??= new Map<string, string>();
      requestContextsExtraHeaders[contextIndex].set(key, value);
      return;
    }
    const throwAwayContextIndex = throwAwayContexts.indexOf(
      workingRequestContext,
    );
    if (throwAwayContextIndex >= 0) {
      throwAwayContextsExtraHeaders[throwAwayContextIndex] ??= new Map<
        string,
        string
      >();
      throwAwayContextsExtraHeaders[throwAwayContextIndex].set(key, value);
    }
  },

  /**
   * Retrieves all custom headers associated with the currently focused request context.
   *
   * @returns An object containing all custom headers (key-value pairs),
   * or undefined if no custom headers are set
   * @throws If the focused request context cannot be found
   */
  getExtraHeaders() {
    const contextIndex = requestContexts.indexOf(workingRequestContext);
    if (contextIndex >= 0) {
      const extraHeaders = requestContextsExtraHeaders[contextIndex];
      return !extraHeaders || extraHeaders.size == 0
        ? undefined
        : Object.fromEntries(extraHeaders);
    }
    const throwAwayContextIndex = throwAwayContexts.indexOf(
      workingRequestContext,
    );
    if (throwAwayContextIndex >= 0) {
      const extraHeaders = throwAwayContextsExtraHeaders[throwAwayContextIndex];
      return !extraHeaders || extraHeaders.size == 0
        ? undefined
        : Object.fromEntries(extraHeaders);
    }
    throw new Error("Could not find workingRequestContext's Extra Headers");
  },

  /**
   * Creates a new persistent request context and sets it as the focused context.
   * This context can be referenced later using switchWorkingContext.
   *
   * @param authenticatedUser - Optional username to load the corresponding
   * storage state file for authentication
   * @returns A step that creates the new persistent context
   */
  openNewContext(authenticatedUser?: string) {
    return test.step(`Opening new Context${authenticatedUser ? ` for user ${authenticatedUser}` : ""}`, async () => {
      console.log(
        `Opening new Context${authenticatedUser ? ` for user ${authenticatedUser}` : ""}`,
      );
      let newContext = await frameworkDataHelper.apiRequest.newContext({
        storageState: storageStateHelper.storageStatePath(authenticatedUser),
      });
      if (authenticatedUser) {
        const generatedFile =
          await storageStateHelper.createStorageStateFileIfNeededViaAPI(
            newContext,
            authenticatedUser,
          );
        if (generatedFile)
          newContext = await frameworkDataHelper.apiRequest.newContext({
            storageState:
              storageStateHelper.storageStatePath(authenticatedUser),
          });
      }
      requestContexts.push(newContext);
      updateWorkingRequestContext(requestContexts.length - 1);
    });
  },

  /**
   * Creates a new throw-away request context and sets it as the focused context.
   * This context cannot be referenced later (single-use only).
   *
   * @param authenticatedUser - Optional username to load the corresponding
   * storage state file for authentication
   * @returns A step that creates the new throw-away context
   */
  openNewThrowAwayContext(authenticatedUser?: string) {
    return test.step(`Opening new Throw Away Context${authenticatedUser ? ` for user ${authenticatedUser}` : ""}`, async () => {
      console.log(
        `Opening new Throw Away Context${authenticatedUser ? ` for user ${authenticatedUser}` : ""}`,
      );
      let newContext = await frameworkDataHelper.apiRequest.newContext({
        storageState: storageStateHelper.storageStatePath(authenticatedUser),
      });
      if (authenticatedUser) {
        const generatedFile =
          await storageStateHelper.createStorageStateFileIfNeededViaAPI(
            newContext,
            authenticatedUser,
          );
        if (generatedFile)
          newContext = await frameworkDataHelper.apiRequest.newContext({
            storageState:
              storageStateHelper.storageStatePath(authenticatedUser),
          });
      }
      throwAwayContexts.push(newContext);
      workingRequestContext = newContext;
    });
  },

  /**
   * Changes the focused request context to one of the previously created persistent contexts.
   *
   * @param requestContextIndex - The index of the context to make focused
   * @returns A step that switches to the specified context
   * @throws If the specified index is out of range or already focused
   */
  switchWorkingContext(requestContextIndex: number) {
    return test.step(`Switching working Context to [${requestContextIndex}]`, () => {
      console.log(`Switching working Context to [${requestContextIndex}]`);
      expect(
        requestContextIndex,
        `Context [${requestContextIndex}] not found`,
      ).toBeLessThan(requestContexts.length);
      expect(
        requestContextIndex,
        `Already working on context [${requestContextIndex}]`,
      ).not.toEqual(this.workingRequestContextIndex);
      updateWorkingRequestContext(requestContextIndex);
    });
  },
};

export default requestHelper;
