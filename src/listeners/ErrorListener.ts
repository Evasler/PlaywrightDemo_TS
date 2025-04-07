import { Page } from "@playwright/test";
import { ErrorListenerOptions } from "../customTypes/FrameworkTypes";

export default class ErrorListener {

    constructor(private readonly _errorListenerOptions: ErrorListenerOptions) { }

    attachTo(page: Page) {
        if (this._errorListenerOptions.failOnJsError)
            page.on("pageerror", (error) => {
                throw new Error(`Uncaught JS error: ${error.message}`);
            });

        if (this._errorListenerOptions.failOnConnectionError)
            page.on("requestfailed", (request) => {
                throw new Error(`Request failed: ${request.url()}`);
            });
        
        if (this._errorListenerOptions.failOnRequestError)
            page.on("requestfinished", async (request) => {
                const response = await request.response();
                if (response !== null && response.status() >= 400)
                    throw new Error(`Error code: \"${response.status()} ${response.statusText()}\" from ${response.url()}`);
            });
    }
}