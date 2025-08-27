/**
 * @description This module provides integration between Playwright tests and Azure DevOps Test Plans.
 * It manages test result reporting to Azure DevOps, including test runs creation, test point validation,
 * and result updates. The helper handles authentication, error reporting, and maintains a clean
 * interface for reporting test outcomes.
 */

import type { APIRequestContext } from "@playwright/test";
import type { Suite, TestCase, TestResult } from "@playwright/test/reporter";
import { request } from "@playwright/test";
import {
  terminalUtils,
  testUtils,
  errorHandlingUtils,
} from "../../utils/index.js";
import type { ResultDetails, RunDetails } from "../../external/azure/types.js";
import { PlansSteps, RunsSteps } from "../../external/azure/services/index.js";

/** Array of test titles that couldn't be reported to Azure */
const unreportedTestTitles: string[] = [];

/** Authorized API request context for Azure DevOps API calls */
let authorizedContext: APIRequestContext;

/** Helper for interacting with Azure DevOps Test Runs */
let runsSteps: RunsSteps;

/** Helper for interacting with Azure DevOps Test Plans */
let plansSteps: PlansSteps;

/** Base URL for the Azure DevOps project */
let projectBaseUrl: string;

/** Personal access token for authenticating with Azure DevOps */
let personalAccessToken: string;

/** ID of the test plan containing the test cases */
let planId: number;

/** IDs of the test suites containing the test cases */
let suiteIds: number[];

/** Test configuration names used to match test cases */
let configurationNames: string[] = [];

/**
 * Checks for errors when retrieving a test point by test case ID.
 *
 * This function attempts to find a test point across all configured suites
 * and returns any errors encountered during the process.
 *
 * @param test - The Playwright test case to look up in Azure DevOps
 * @returns An array containing error messages if any were encountered, otherwise an empty array
 */
async function getRequestErrors(test: TestCase) {
  let _testId;
  try {
    _testId = testUtils.id(test);
    for (const suiteId of suiteIds) {
      const requestError = await plansSteps.getRequestError(
        planId,
        suiteId,
        parseInt(_testId),
      );
      if (requestError) return [requestError];
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Validates if a project name contains one of the required configuration names.
 *
 * This function checks if the project name includes exactly one of the expected
 * configuration names, which is necessary for proper test reporting to Azure DevOps.
 *
 * @param projectName - The name of the Playwright project to validate
 * @returns An array of error messages if validation fails, otherwise an empty array
 */
function getProjectErrors(projectName: string) {
  const projectErrors = [];
  const projectConfigurations = configurationNames.filter((configuration) =>
    projectName.includes(configuration),
  );
  if (configurationNames.length > 0)
    if (projectConfigurations.length === 0)
      projectErrors.push(
        `Project "${projectName}" does not specify the configuration (${configurationNames.join("|")})`,
      );
    else if (projectConfigurations.length > 1)
      projectErrors.push(
        `Project "${projectName}" specifies multiple configurations (${configurationNames.join("|")})`,
      );
  return projectErrors;
}

/**
 * Validates a test case title and checks if the corresponding test point exists in Azure DevOps.
 *
 * This function performs several validations:
 * 1. Checks if the test title has the correct format (should include ":")
 * 2. Verifies the test ID is a number
 * 3. If the request to Azure was successful, checks if the test point exists in Azure DevOps
 *
 * @param test - The Playwright test case to validate
 * @param projectName - The name of the Playwright project
 * @param requestWasSuccessful - Whether previous API requests to Azure were successful
 * @returns An array of error messages if validation fails, otherwise an empty array
 */
async function getTestErrors(
  test: TestCase,
  projectName: string,
  requestWasSuccessful: boolean,
) {
  const titleErrors: string[] = [];
  const testPointErrors: string[] = [];

  if (!test.title.includes(":"))
    titleErrors.push(`Title "${test.title}" should include a ":"`);
  const testId = test.title.substring(0, test.title.indexOf(":"));
  if (titleErrors.length === 0 && !/\d+/.test(testId))
    titleErrors.push(`TestId "${testId}" should be a number`);

  if (requestWasSuccessful) {
    const projectConfigurations = configurationNames.filter((configuration) =>
      projectName.includes(configuration),
    );
    if (titleErrors.length === 0 && projectConfigurations.length === 1)
      if (!(await testPointExists(test)))
        testPointErrors.push(
          `Test Point [${testId},${projectConfigurations[0]}] not found in ${suiteIds.length > 1 ? "Suites" : "Suite"} ${suiteIds.join(",")} of Plan ${planId}`,
        );
  }
  return [...titleErrors, ...testPointErrors];
}

/**
 * Checks if a test point for a given test case exists in Azure DevOps.
 *
 * This function attempts to find a test point for the specified test case
 * across all configured test suites and with the appropriate configuration.
 *
 * @param test - The Playwright test case to check
 * @returns True if the test point exists, false otherwise or if an error occurred
 */
async function testPointExists(test: TestCase) {
  let _testId;
  let _projectConfiguration;
  try {
    _testId = testUtils.id(test);
    _projectConfiguration = testUtils.projectConfiguration(
      test,
      configurationNames,
    );
    for (const suiteId of suiteIds) {
      const testPointId = await plansSteps.getTestPointId(
        planId,
        suiteId,
        parseInt(_testId),
        _projectConfiguration,
      );
      if (testPointId) return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Helper module for integrating Playwright test reporting with Azure DevOps Test Plans.
 *
 * This module provides a comprehensive set of functions to handle Azure DevOps test reporting,
 * including creating test runs, validating test cases, updating test results, and handling
 * errors in the reporting process.
 */
const azureReportHelper = {
  /**
   * Initializes the Azure report helper with connection and test plan details.
   *
   * @param azureData - Configuration object containing Azure DevOps connection details
   * @param azureData.projectBaseUrl - Base URL for the Azure DevOps project API
   * @param azureData.personalAccessToken - PAT for authenticating with Azure DevOps
   * @param azureData.planId - ID of the test plan containing the test cases
   * @param azureData.suiteIds - Array of test suite IDs containing the test cases
   * @param azureData.configurationNames - Array of configuration names to match with tests
   */
  init(azureData: {
    projectBaseUrl: string;
    personalAccessToken: string;
    planId: number;
    suiteIds: number[];
    configurationNames: string[];
  }) {
    projectBaseUrl = azureData.projectBaseUrl;
    personalAccessToken = azureData.personalAccessToken;
    planId = azureData.planId;
    suiteIds = azureData.suiteIds;
    configurationNames = azureData.configurationNames;
  },

  /**
   * Creates an authorized API request context for Azure DevOps API calls.
   *
   * This method initializes a new request context with the Personal Access Token
   * for authentication and instantiates the RunsSteps and PlansSteps helpers.
   */
  async openAuthorizedContext() {
    authorizedContext = await request.newContext({
      extraHTTPHeaders: {
        Authorization:
          "Basic " + Buffer.from(`:${personalAccessToken}`).toString("base64"),
      },
    });
    runsSteps = new RunsSteps(authorizedContext, projectBaseUrl);
    plansSteps = new PlansSteps(authorizedContext, projectBaseUrl);
  },

  /**
   * Updates the test result in Azure DevOps based on Playwright's test result.
   *
   * This method:
   * 1. Extracts the test ID and configuration from the test case
   * 2. Finds the corresponding test point ID in Azure DevOps
   * 3. Gets the result ID for the test point in the current run
   * 4. Maps the Playwright test status to an Azure DevOps outcome
   * 5. Updates the test result with details including duration and error message
   *
   * If the test is in the unreportedTestTitles list, it will be skipped.
   *
   * @param runId - The ID of the Azure DevOps test run
   * @param test - The Playwright test case that was executed
   * @param result - The Playwright test result with status and timing information
   */
  async updateResult(runId: number, test: TestCase, result: TestResult) {
    let _testId;
    let _projectConfiguration;
    try {
      _testId = testUtils.id(test);
      _projectConfiguration = testUtils.projectConfiguration(
        test,
        configurationNames,
      );
    } catch {
      return;
    }
    if (!unreportedTestTitles.includes(_testId)) {
      for (const suiteId of suiteIds) {
        const testPointId = await plansSteps.getTestPointId(
          planId,
          suiteId,
          parseInt(_testId),
          _projectConfiguration,
        );
        if (!testPointId) continue;
        const testResultId = await runsSteps.getResultId(
          runId,
          String(testPointId),
        );
        if (!testResultId) return;
        const outcome =
          result.status === "passed"
            ? "Passed"
            : result.status === "skipped"
              ? "NotExecuted"
              : "Failed";
        const testResultDetails: ResultDetails = {
          id: testResultId,
          outcome: outcome,
          state: "Completed",
          startedDate: result.startTime.toISOString(),
          durationInMs: result.duration,
          errorMessage: result.error?.message
            ? terminalUtils.clearOutput(result.error.message)
            : undefined,
        };
        await runsSteps.updateResult(runId, testResultDetails);
      }
    }
  },

  /**
   * Logs warnings for tests that couldn't be reported to Azure DevOps.
   *
   * This method outputs warning messages for all test titles that were tracked
   * as unreported during the test run.
   */
  printUnreportedTestResultsWarning() {
    if (unreportedTestTitles.length > 0)
      errorHandlingUtils.reportWarnings(
        "Azure",
        unreportedTestTitles.map(
          (title) => `Test result not reported: ${title}`,
        ),
      );
  },

  /**
   * Validates all tests in the suite for Azure reporting compatibility.
   *
   * This method performs comprehensive validation of all tests to ensure they can be
   * properly reported to Azure DevOps. It collects and reports errors for:
   * 1. API request errors when checking test points
   * 2. Project configuration errors (missing or multiple configurations)
   * 3. Test title format and ID errors
   * 4. Missing test points in Azure DevOps
   *
   * If any errors are found, it will report them and stop test execution.
   *
   * @param rootSuite - The root Playwright test suite containing all tests
   * @throws Error if any tests cannot be reported to Azure DevOps
   */
  async throwReportingErrors(rootSuite: Suite) {
    const requestErrors: string[] = [];
    const projectErrors: string[] = [];
    const testErrors: string[] = [];
    for (const projectSuite of rootSuite.suites) {
      const project = projectSuite.project();
      if (!project)
        throw new Error(
          `Suite "${projectSuite.title}" does not have a project defined.`,
        );
      const projectName = project.name;
      projectErrors.push(...getProjectErrors(projectName));
      for (const test of projectSuite.allTests()) {
        if (requestErrors.length === 0)
          requestErrors.push(...(await getRequestErrors(test)));
        testErrors.push(
          ...(await getTestErrors(
            test,
            projectName,
            requestErrors.length === 0,
          )),
        );
      }
    }
    const uniqueReportingErrors = [
      ...new Set([...requestErrors, ...projectErrors, ...testErrors]),
    ];
    if (uniqueReportingErrors.length > 0)
      errorHandlingUtils.reportErrors("Azure", uniqueReportingErrors);
  },

  /**
   * Gets all test point IDs for tests in the suite that exist in Azure DevOps.
   *
   * This method iterates through all tests in the suite and:
   * 1. Extracts the test ID and configuration
   * 2. Checks if a corresponding test point exists in Azure DevOps
   * 3. Collects all found test point IDs
   * 4. Tracks tests that couldn't be reported in the unreportedTestTitles array
   *
   * @param rootSuite - The root Playwright test suite containing all tests
   * @returns An array of test point IDs that exist in Azure DevOps
   */
  async getPointIds(rootSuite: Suite) {
    const pointIds = [];
    for (const test of rootSuite.allTests()) {
      let _testId;
      let _projectConfiguration;
      try {
        _testId = testUtils.id(test);
        _projectConfiguration = testUtils.projectConfiguration(
          test,
          configurationNames,
        );
      } catch {
        unreportedTestTitles.push(test.title);
        continue;
      }
      let reported = false;
      for (const suiteId of suiteIds) {
        const testPointId = await plansSteps.getTestPointId(
          planId,
          suiteId,
          parseInt(_testId),
          _projectConfiguration,
        );
        if (testPointId) {
          pointIds.push(testPointId);
          reported = true;
        }
      }
      if (!reported) unreportedTestTitles.push(test.title);
    }
    return pointIds;
  },

  /**
   * Creates a test run in Azure DevOps and handles any user-facing errors.
   *
   * This method wraps the creation of a test run to provide better error handling,
   * making it suitable for user-facing scenarios where clear error messages are needed.
   *
   * @param runDetails - Details for the test run to create
   * @returns Either an error message if creation failed, or the ID of the created test run
   */
  async createRunAndCatchUserError(runDetails: RunDetails) {
    const runIdAndUserError =
      await runsSteps.createRunAndCatchUserError(runDetails);
    return runIdAndUserError;
  },

  /**
   * Updates an existing test run in Azure DevOps with new details.
   *
   * This method can be used to update properties of a test run such as
   * its name, state, or completion date.
   *
   * @param runId - The ID of the Azure DevOps test run to update
   * @param runDetails - New details to apply to the test run
   */
  async updateRun(runId: number, runDetails: RunDetails) {
    await runsSteps.updateRun(runId, runDetails);
  },
};

export default azureReportHelper;
