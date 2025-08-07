import { expect, type Page } from "@playwright/test";
import frameworkDataHelper from "../helpers/data/frameworkDataHelper.js";

/**
 * Facilitates attaching listeners.
 */
const errorListener = {
  /**
   * Attaches different error listeners to the page, based on the provided ErrorListenerOptions.
   * @param page
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
      page.on("requestfinished", async (request) => {
        const response = await request.response();
        if (response !== null)
          expect(
            response.status(),
            `Error code: "${response.status()} ${response.statusText()}" from ${response.url()}`,
          ).toBeLessThan(400);
      });
  },
};

export default errorListener;
