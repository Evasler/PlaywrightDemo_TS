import type { Page } from "@playwright/test";
import { frameworkDataHelper } from "../helpers/index.js";

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
                throw new Error(`Uncaught JS error: ${error.message}`);
            });
        if (frameworkDataHelper.errorListenerOptions.failOnConnectionError)
            page.on("requestfailed", (request) => {
                throw new Error(`Request failed: ${request.url()}`);
            });
        if (frameworkDataHelper.errorListenerOptions.failOnRequestError)
            page.on("requestfinished", async (request) => {
                const response = await request.response();
                if (response !== null && response.status() >= 400)
                    throw new Error(`Error code: "${response.status()} ${response.statusText()}" from ${response.url()}`);
            });
    }
};

export default errorListener;