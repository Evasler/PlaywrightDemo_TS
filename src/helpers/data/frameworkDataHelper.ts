/**
 * @description This module provides a centralized data store for sharing essential objects
 * across various modules of the test framework.
 */

import type { APIRequest, Browser } from "@playwright/test";
import type { ErrorListenerOptions } from "../../types/index.js";

/** Playwright's API request context for making API calls */
let apiRequest: APIRequest;

/** Base URL of the application under test */
let baseUrl: string;

/** Playwright's Browser instance for UI testing */
let browser: Browser;

/** Configuration options for error listener behavior */
let errorListenerOptions: ErrorListenerOptions;

/**
 * Helper module that serves as a centralized store for framework-level data.
 *
 * This module provides access to core Playwright objects and configuration settings
 * that need to be shared across different parts of the test framework. It facilitates
 * a method-chaining pattern by providing consistent access to these objects
 * throughout the test execution lifecycle.
 */
const frameworkDataHelper = {
  /**
   * @returns The Playwright API request context for making API calls
   */
  get apiRequest() {
    return apiRequest;
  },

  /**
   * @returns The base URL of the application under test
   */
  get baseUrl() {
    return baseUrl;
  },

  /**
   * @returns The API URL of the application under test
   */
  get apiUrl() {
    return `${baseUrl}api/`;
  },

  /**
   * @returns The Playwright Browser instance for UI testing
   */
  get browser() {
    return browser;
  },

  /**
   * @returns The error listener configuration options
   */
  get errorListenerOptions() {
    return errorListenerOptions;
  },

  /**
   * Initializes the framework data with required objects and configuration
   *
   * @param frameworkData - Object containing the required framework data
   * @param frameworkData.apiRequest - Playwright's API request context
   * @param frameworkData.baseUrl - Base URL of the application under test
   * @param frameworkData.browser - Playwright's Browser instance
   * @param frameworkData.errorListenerOptions - Error listener configuration
   */
  init(frameworkData: {
    apiRequest: APIRequest;
    baseUrl: string;
    browser: Browser;
    errorListenerOptions: ErrorListenerOptions;
  }) {
    apiRequest = frameworkData.apiRequest;
    baseUrl = frameworkData.baseUrl;
    browser = frameworkData.browser;
    errorListenerOptions = frameworkData.errorListenerOptions;
  },
};

export default frameworkDataHelper;
