import { expect, Page, request, Request } from "@playwright/test";

export class ErrorListener {

    attachTo(page: Page) {
        page.on("pageerror", (error) => {
            throw new Error(`Uncaught JS error: ${error.message}`);
        });

        page.on("requestfailed", (request) => {
            throw new Error(`Request failed: ${request.url()}`);
        });
        
        page.on("requestfinished", async (request) => {
            const response = await request.response();
            if (response !== null && response.status() >= 400)
                throw new Error(`Error code: \"${response.status()} ${response.statusText()}\" from ${response.url()}`);
        });
    }
}