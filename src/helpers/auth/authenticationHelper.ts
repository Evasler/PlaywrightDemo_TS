import { baseUrl, browser } from "playwrap";
import { credentialsUtils, fileUtils } from "../../utils/index.js";
import type { APIRequestContext } from "playwright-core";
import { expect } from "playwright/test";
import z from "zod";
import type { StorageState } from "../../types/index.js";

export async function openAuthorizedContext(authenticatedUser?: string) {
  const filePath = fileUtils.fileExists(storageStateFilePath(authenticatedUser))
    ? storageStateFilePath(authenticatedUser)
    : undefined;
  let newContext = await browser().newContext({
    storageState: filePath,
  });
  if (authenticatedUser) {
    const generatedFile = await createStorageStateFileIfNeededViaAPI(
      newContext.request,
      authenticatedUser,
    );
    if (generatedFile) {
      await newContext.close();
      newContext = await browser().newContext({
        storageState: storageStateFilePath(authenticatedUser),
      });
    }
  }
  return newContext;
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
async function createStorageStateFile(
  workingRequest: APIRequestContext,
  user: string,
) {
  console.log(`Generating ${storageStateFilePath(user)}`);
  const credentials = credentialsUtils.getUserCredentials(user);
  const response = await workingRequest.post(`${baseUrl()}api/auth/login`, {
    data: credentials,
  });
  expect(response.status()).toEqual(200);
  const responseJson = z
    .strictObject({
      token: z.string().regex(/^[A-Za-z0-9]{16}$/),
    })
    .parse(await response.json());
  const storageStateTemplate = JSON.parse(
    fileUtils.readFile(
      "./resources/other/restfulBookerStorageStateTemplate.json",
    ),
  ) as StorageState;
  storageStateTemplate.cookies[0].value = responseJson.token;
  if (!fileUtils.fileExists(`.auth`)) fileUtils.makeDirectory(`.auth`);
  fileUtils.writeFile(
    storageStateFilePath(user),
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
async function contextIsAuthorized(workingRequest: APIRequestContext) {
  let contextIsAuthorized = false;
  const tokenCookie = (await workingRequest.storageState()).cookies.find(
    (cookie) => cookie.name === "token",
  );
  if (tokenCookie) {
    const token = tokenCookie.value;
    const response = await workingRequest.post(
      `${baseUrl()}api/auth/validate`,
      {
        data: { token: token },
      },
    );
    contextIsAuthorized = response.ok();
  }
  console.log(
    `Context is ${contextIsAuthorized ? "authorized" : "unauthorized"}`,
  );
  return contextIsAuthorized;
}

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
async function createStorageStateFileIfNeededViaAPI(
  workingRequest: APIRequestContext,
  authenticatedUser: string,
) {
  if (fileUtils.fileExists(storageStateFilePath(authenticatedUser))) {
    const workingContextIsAuthorized =
      await contextIsAuthorized(workingRequest);
    if (!workingContextIsAuthorized) {
      await createStorageStateFile(workingRequest, authenticatedUser);
      return true;
    }
  } else {
    await createStorageStateFile(workingRequest, authenticatedUser);
    return true;
  }
  return false;
}

/**
 * Generates the relative path to a user's storage state file.
 *
 * @param user - The username identifier for the storage state file
 * @returns The relative path to the user's storageState file
 */
function storageStateFilePath(user?: string) {
  return `.auth/${user}.json`;
}
