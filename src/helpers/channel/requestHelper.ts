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
 * @param requestContextIndex
 */
function updateWorkingRequestContext(requestContextIndex: number) {
  workingRequestContext = requestContexts[requestContextIndex];
}

/**
 * Manages all actions related to the Request Context.
 * Holds a reference to the focused Request Context and all Request Contexts created by openNewContext and openNewThrowAwayContext.
 * A set of extra headers is stored for each Request Context and can be applied to its requests.
 */
const requestHelper = {
  /**
   * The focused Request Context.
   */
  get workingRequestContext() {
    return workingRequestContext;
  },

  /**
   * The index of the focused Request Context.
   */
  get workingRequestContextIndex() {
    return requestContexts.indexOf(workingRequestContext);
  },

  /**
   * Stores extra headers, for the focused Request Context.
   * @param key
   * @param value
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
   * Throws error if the focused Request Context is not stored.
   * @returns The extra headers for the focused Request Context.
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
   * Opens a new Request Context. The new Request Context is focused. If needed it can be focused again by switchWorkingContext.
   * @param authenticatedUser Allows avoiding the login process, by loading the user's storageState file in the Request Context.
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
   * Opens a new Request Context. The new Request Context is focused. It cannot be focused again.
   * @param authenticatedUser Allows avoiding the login process, by loading the user's storageState file in the Request Context.
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
   * Sets the focused Request Context.
   * @param requestContextIndex
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
