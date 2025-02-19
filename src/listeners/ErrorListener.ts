import { Page } from "@playwright/test";

export class ErrorListener {

    constructor(
        private readonly failOnJsError: boolean, 
        private readonly failOnConnectionError: boolean, 
        private readonly failOnRequestError: boolean
    ) { }

    attachTo(page: Page) {
        if (this.failOnJsError)
            page.on("pageerror", (error) => {
                throw new Error(`Uncaught JS error: ${error.message}`);
            });

        if (this.failOnConnectionError)
            page.on("requestfailed", (request) => {
                throw new Error(`Request failed: ${request.url()}`);
            });
        
        if (this.failOnRequestError)
            page.on("requestfinished", async (request) => {
                const response = await request.response();
                if (response !== null && response.status() >= 400)
                    throw new Error(`Error code: \"${response.status()} ${response.statusText()}\" from ${response.url()}`);
            });
    }
}