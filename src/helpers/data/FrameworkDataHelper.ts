import { APIRequest, Browser } from "@playwright/test";
import { ErrorListenerOptions } from "../../customTypes/FrameworkTypes";

let apiRequest: APIRequest;
let baseUrl: string;
let browser: Browser;
let errorListenerOptions: ErrorListenerOptions;

/**
 * Facilitates data-sharing between methods, while writing Tests in a method-chaining manner. 
 */
const frameworkDataHelper = {
    get apiRequest() { return apiRequest; },
    get baseUrl() { return baseUrl; },
    get apiUrl() { return `${baseUrl}api/`; },
    get browser() { return browser; },
    get errorListenerOptions() { return errorListenerOptions; },
    init(frameworkData: { apiRequest: APIRequest, baseUrl: string, browser: Browser, errorListenerOptions: ErrorListenerOptions }) {
        apiRequest = frameworkData.apiRequest;
        baseUrl = frameworkData.baseUrl;
        browser = frameworkData.browser;
        errorListenerOptions = frameworkData.errorListenerOptions;
    }
}

export default frameworkDataHelper;