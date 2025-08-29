import { expect, type Page } from "@playwright/test";
import frameworkDataHelper from "../helpers/data/frameworkDataHelper.js";

/**
 * @description This module provides error handling capabilities by attaching various
 * error listeners to Playwright page objects.
 */

/**
 * Helper module for attaching error listeners to Playwright pages.
 *
 * This module allows attaching different types of error listeners to Playwright page
 * objects based on configuration settings. It helps detect and report various error
 * conditions during test execution, such as JavaScript errors, network failures, and
 * HTTP error responses.
 */
const errorListener = {
  /**
   * Attaches error listeners to a Playwright page based on the configuration
   *
   * Depending on the framework's error listener configuration, this method can attach
   * listeners for JavaScript errors, connection failures, and HTTP error responses.
   * When errors occur, test assertions will fail with descriptive error messages.
   *
   * @param page - The Playwright Page object to attach listeners to
   */
  attachTo(page: Page) {
    if (frameworkDataHelper.errorListenerOptions.failOnJsError)
      page.on("pageerror", (error) => {
        expect(error, `Uncaught JS error: ${error.message}`).toBeUndefined();
      });
    if (frameworkDataHelper.errorListenerOptions.failOnConnectionError)
      page.on("requestfailed", (request) => {
        expect(
          request.failure(),
          `Request failed [${request.failure()?.errorText}]: ${request.url()}`,
        ).toBeUndefined();
      });
    if (frameworkDataHelper.errorListenerOptions.failOnRequestError)
      page.on("response", (response) => {
        if (response.status() >= 400) //Necessary to reduce the amount of logs in Trace
          expect(
            response.status(),
            `Error code: "${response.status()} ${response.statusText()}" from ${response.url()}`,
          ).toBeLessThan(400);
      });
  },
};

export default errorListener;
