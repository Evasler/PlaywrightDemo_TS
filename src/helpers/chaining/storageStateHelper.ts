/**
 * @description This module provides functionality for managing browser storage state files
 * for authenticated users. It supports both API and UI-based authentication
 * methods to create, validate, and refresh storage state files, which are used
 * to maintain authentication between test runs.
 */

import { type APIRequestContext, type Page, expect } from "@playwright/test";
import { credentialsUtils, fileUtils } from "../../utils/index.js";
import type { StorageState, LoginResponse } from "../../types/index.js";
import frameworkDataHelper from "../data/frameworkDataHelper.js";

const authDirectory = ".auth";

/**
 * Generates the relative path to a user's storage state file.
 *
 * @param user - The username identifier for the storage state file
 * @returns The relative path to the user's storageState file
 */
function storageStatePath(user: string) {
  return `${authDirectory}/${user}.json`;
}

/**
 * Creates a storage state file via API authentication.
 *
 * This function authenticates a user through API calls, obtains an authentication token,
 * and saves it in a storage state file based on the template file.
 *
 * @param workingRequest - The Playwright API request context to use for authentication
 * @param user - The username identifier for the storage state file
 */
async function createStorageStateFileViaAPI(
  workingRequest: APIRequestContext,
  user: string,
) {
  console.log(`Generating ${storageStatePath(user)}`);
  const credentials = credentialsUtils.getUserCredentials(user);
  const response = await workingRequest.post(
    `${frameworkDataHelper.apiUrl}auth/login`,
    { data: credentials },
  );
  expect(response.status()).toEqual(200);
  const responseJson = (await response.json()) as LoginResponse;
  const storageStateTemplate = JSON.parse(
    fileUtils.readFile(
      "./resources/other/restfulBookerStorageStateTemplate.json",
    ),
  ) as StorageState;
  storageStateTemplate.cookies[0].value = responseJson.token;
  if (!fileUtils.fileExists(authDirectory))
    fileUtils.makeDirectory(authDirectory);
  fileUtils.writeFile(
    storageStatePath(user),
    JSON.stringify(storageStateTemplate, null, 2),
  );
}

/**
 * Checks if a request context is authorized via API.
 *
 * This function verifies if the current API request context contains valid
 * authentication cookies by validating the token with the server.
 *
 * @param workingRequest - The Playwright API request context to check
 * @returns A boolean indicating whether the context is authorized
 */
async function contextIsAuthorizedViaAPI(workingRequest: APIRequestContext) {
  let contextIsAuthorized = false;
  const tokenCookie = (await workingRequest.storageState()).cookies.find(
    (cookie) => cookie.name === "token",
  );
  if (tokenCookie) {
    const token = tokenCookie.value;
    const response = await workingRequest.post(
      `${frameworkDataHelper.apiUrl}auth/validate`,
      { data: { token: token } },
    );
    contextIsAuthorized = response.ok();
  }
  console.log(
    `Context is ${contextIsAuthorized ? "authorized" : "unauthorized"}`,
  );
  return contextIsAuthorized;
}

/**
 * Creates a storage state file via UI authentication.
 *
 * This function logs in a user through the UI interface, waits for successful authentication,
 * and then saves the browser context's storage state to a file.
 *
 * @param workingTab - The Playwright Page object to use for UI authentication
 * @param user - The username identifier for the storage state file
 */
async function createStorageStateFileViaUI(workingTab: Page, user: string) {
  console.log(`Generating ${storageStatePath(user)}`);
  const credentials = credentialsUtils.getUserCredentials(user);
  await workingTab.goto(`${frameworkDataHelper.baseUrl}admin`);
  await workingTab
    .getByRole("textbox", { name: "Username", exact: true })
    .fill(credentials.username);
  await workingTab
    .getByRole("textbox", { name: "Password", exact: true })
    .fill(credentials.password);
  await workingTab.getByRole("button", { name: "Login", exact: true }).click();
  await expect(
    workingTab.getByRole("link", { name: "Rooms", exact: true }),
  ).toBeVisible();
  await workingTab.context().storageState({ path: storageStatePath(user) });
}

/**
 * Checks if a browser context is authorized via UI verification.
 *
 * This function navigates to the admin page and checks for the presence of
 * UI elements that indicate successful authentication.
 *
 * @param workingTab - The Playwright Page object to check
 * @returns A boolean indicating whether the browser context is authorized
 */
async function contextIsAuthorizedViaUI(workingTab: Page) {
  if (workingTab.url() !== `${frameworkDataHelper.baseUrl}admin`)
    await workingTab.goto(`${frameworkDataHelper.baseUrl}admin`);
  try {
    await expect(
      workingTab.getByRole("link", { name: "Rooms", exact: true }),
    ).toBeVisible({ timeout: 5000 });
    console.log("Context is authorized");
    return true;
  } catch {
    console.log("Context is unauthorized");
    return false;
  }
}

/**
 * Helper module for managing authentication storage state files.
 *
 * This module provides utilities for creating, validating, and refreshing storage state files
 * that maintain authentication between test runs, supporting both API and UI authentication methods.
 */
const storageStateHelper = {
  /**
   * Gets the path to a user's storage state file if it exists.
   *
   * @param user - The username identifier for the storage state file
   * @returns The relative path to the user's storageState file if it exists, otherwise undefined
   */
  storageStatePath(user?: string) {
    if (!user) return undefined;
    if (!fileUtils.fileExists(storageStatePath(user))) return undefined;
    return storageStatePath(user);
  },

  /**
   * Creates or refreshes a storage state file using API authentication if needed.
   *
   * This method checks if the storage state file exists and if its content is valid.
   * If the file doesn't exist or contains invalid authentication data, it creates
   * or refreshes the file using API authentication.
   *
   * @param workingRequest - The Playwright API request context to use for authentication
   * @param authenticatedUser - The username identifier for the storage state file
   * @returns A boolean indicating whether a new storage state file was created
   */
  async createStorageStateFileIfNeededViaAPI(
    workingRequest: APIRequestContext,
    authenticatedUser: string,
  ) {
    if (fileUtils.fileExists(storageStatePath(authenticatedUser))) {
      const workingContextIsAuthorized =
        await contextIsAuthorizedViaAPI(workingRequest);
      if (!workingContextIsAuthorized) {
        await createStorageStateFileViaAPI(workingRequest, authenticatedUser);
        return true;
      }
    } else {
      await createStorageStateFileViaAPI(workingRequest, authenticatedUser);
      return true;
    }
    return false;
  },

  /**
   * Creates or refreshes a storage state file using UI authentication if needed.
   *
   * This method checks if the storage state file exists and if its content is valid.
   * If the file doesn't exist or contains invalid authentication data, it creates
   * or refreshes the file using UI-based authentication.
   *
   * @param workingTab - The Playwright Page object to use for UI authentication
   * @param authenticatedUser - The username identifier for the storage state file
   * @returns A boolean indicating whether a new storage state file was created
   */
  async createStorageStateFileIfNeededViaUI(
    workingTab: Page,
    authenticatedUser: string,
  ) {
    if (fileUtils.fileExists(storageStatePath(authenticatedUser))) {
      const workingContextIsAuthorized =
        await contextIsAuthorizedViaUI(workingTab);
      if (!workingContextIsAuthorized) {
        await createStorageStateFileViaUI(workingTab, authenticatedUser);
        return true;
      }
    } else {
      await createStorageStateFileViaUI(workingTab, authenticatedUser);
      return true;
    }
    return false;
  },
};

export default storageStateHelper;
