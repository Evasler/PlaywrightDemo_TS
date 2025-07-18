import type { APIRequestContext } from "@playwright/test"
import type { Suite, TestCase, TestResult } from "@playwright/test/reporter";
import { request } from "@playwright/test";
import terminalUtils from "../../utils/terminalUtils.js";
import testUtils from "../../utils/testUtils.js";
import errorHandlingUtils from "../../utils/errorHandlingUtils.js";
import RunsSteps from "../../azureServices/Test/Runs/RunsSteps.js";
import PlansSteps from "../../azureServices/Test/Plans/PlansSteps.js";
import type { ResultDetails, RunDetails } from "../../types/frameworkTypes.js";

const unreportedTestTitles: string[] = [];
let authorizedContext: APIRequestContext;
let runsSteps: RunsSteps;
let plansSteps: PlansSteps;
let projectBaseUrl: string;
let personalAccessToken: string; 
let planId: number;
let suiteIds: number[];
let configurationNames: string[] = [];

/**
 * Gets a Test Point by Test Case ID.
 * @param test 
 * @returns An array containing the error message, if there was an error. Otherwise, an empty array.
 */
async function getRequestErrors(test: TestCase) {
    let _testId;
    try {
        _testId = testUtils.id(test);
        for (const suiteId of suiteIds) {
            const requestError = await plansSteps.getRequestError(planId, suiteId, parseInt(_testId));
            if (requestError)
                return [ requestError ];
        }
        return [];
    } catch {
        return [];
    }
};

/**
 * Gets the configurations specified by projectName.
 * @param projectName 
 * @returns An array containing the error message, if there was an error. Otherwise, an empty array.
 */
function getProjectErrors(projectName: string) {
    const projectErrors = [];
    const projectConfigurations = configurationNames.filter(configuration => projectName.includes(configuration));
    if (configurationNames.length > 0)
        if (projectConfigurations.length === 0)
            projectErrors.push(`Project "${projectName}" does not specify the configuration (${configurationNames.join("|")})`);
        else if (projectConfigurations.length > 1)
            projectErrors.push(`Project "${projectName}" specifies multiple configurations (${configurationNames.join("|")})`);
    return projectErrors;
};

/**
 * Checks if a test point exists.
 * @param test 
 * @param projectName 
 * @param requestWasSuccessful 
 * @returns An array containing the error message, if there was an error or if the test point doesn't exist. Otherwise, an empty array.
 */
async function getTestErrors(test: TestCase, projectName: string, requestWasSuccessful: boolean) {
    const titleErrors: string[] = [];
    const testPointErrors: string[] = [];

    if (!test.title.includes(":"))
        titleErrors.push(`Title "${test.title}" should include a ":"`);
    const testId = test.title.substring(0, test.title.indexOf(":"));
    if (titleErrors.length === 0 && !/\d+/.test(testId))
        titleErrors.push(`TestId "${testId}" should be a number`);

    if (requestWasSuccessful) {
        const projectConfigurations = configurationNames.filter(configuration => projectName.includes(configuration));
        if (titleErrors.length === 0 && projectConfigurations.length === 1)
            if (!await testPointExists(test))
                testPointErrors.push(`Test Point [${testId},${projectConfigurations[0]}] not found in ${suiteIds.length > 1 ? "Suites" : "Suite"} ${suiteIds.join(",")} of Plan ${planId}`);
    }
    return [...titleErrors, ...testPointErrors];
};
    
/**
 * @param test 
 * @returns False if there was an error or if the test point doesn't exist. Otherwise, true.
 */
async function testPointExists(test: TestCase) {
    let _testId;
    let _projectConfiguration
    try {
        _testId= testUtils.id(test);
        _projectConfiguration = testUtils.projectConfiguration(test, configurationNames);
        for (const suiteId of suiteIds) {
            const testPointId = await plansSteps.getTestPointId(planId, suiteId, parseInt(_testId), _projectConfiguration);
            if (testPointId)
                return true;
        }
        return false;
    } catch {
        return false;
    }
}

/**
 * Facilitates all Azure actions performed by AzureReporter.
 */
const azureReportHelper = {

    init(azureData: { projectBaseUrl: string, personalAccessToken: string, planId: number, suiteIds: number[], configurationNames: string[] }) {
        projectBaseUrl = azureData.projectBaseUrl;
        personalAccessToken = azureData.personalAccessToken;
        planId = azureData.planId;
        suiteIds = azureData.suiteIds;
        configurationNames = azureData.configurationNames;
    },

    /**
     * Opens a new Request Context, which is authorized to perform API calls to Azure.
     */
    async openAuthorizedContext() {
        authorizedContext = await request.newContext({
            extraHTTPHeaders: {
                Authorization: 'Basic ' + Buffer.from(`:${personalAccessToken}`).toString('base64')
            }
        });
        runsSteps = new RunsSteps(authorizedContext, projectBaseUrl);
        plansSteps = new PlansSteps(authorizedContext, projectBaseUrl);
    },

    /**
     * Updates the result of the test run, based on Playwright's test result.
     * @param runId 
     * @param test 
     * @param result 
     */
    async updateResult(runId: number, test: TestCase, result: TestResult) {
        let _testId;
        let _projectConfiguration;
        try {
            _testId = testUtils.id(test);
            _projectConfiguration = testUtils.projectConfiguration(test, configurationNames);
        } catch {
            return;
        }
        if (!unreportedTestTitles.includes(_testId)) {
            for (const suiteId of suiteIds) {
                const testPointId = await plansSteps.getTestPointId(planId, suiteId, parseInt(_testId), _projectConfiguration);
                if (!testPointId)
                    return;
                const testResultId = await runsSteps.getResultId(runId, String(testPointId));
                if (!testResultId)
                    return;
                const outcome = result.status === "passed" ? "Passed" : (result.status === 'skipped' ? "NotExecuted" : "Failed");
                const testResultDetails: ResultDetails = {
                    id: testResultId,
                    outcome: outcome,
                    state: "Completed",
                    startedDate: result.startTime.toISOString(),
                    durationInMs: result.duration,
                    errorMessage: result.error?.message ? terminalUtils.clearOutput(result.error.message) : undefined
                }
                await runsSteps.updateResult(runId, testResultDetails)
            }
        }
    },
    
    /**
     * Lists the title of all tests, which weren't reported.
     */
    printUnreportedTestResultsWarning() {
        if (unreportedTestTitles.length > 0)
            errorHandlingUtils.reportWarnings("Azure", unreportedTestTitles.map(title => `Test result not reported: ${title}`));
    },

    /**
     * Checks if all tests of rootSuite can be reported on Azure.
     * Lists all error messages and stops the execution, if there are any errors.
     * @param rootSuite 
     */
    async throwReportingErrors(rootSuite: Suite) {
        const requestErrors: string[] = [];
        const projectErrors: string[] = [];
        const testErrors: string[] = [];
        for (const projectSuite of rootSuite.suites) {
            const project = projectSuite.project();
            if(!project)
                throw new Error(`Suite "${projectSuite.title}" does not have a project defined.`);
            const projectName = project.name;
            projectErrors.push(...getProjectErrors(projectName));
            for (const test of projectSuite.allTests()) {
                if (requestErrors.length === 0)
                    requestErrors.push(...await getRequestErrors(test));
                testErrors.push(...await getTestErrors(test, projectName, requestErrors.length === 0));
            }
        }
        const uniqueReportingErrors = [...new Set([...requestErrors, ...projectErrors, ...testErrors])];
        if (uniqueReportingErrors.length > 0)
            errorHandlingUtils.reportErrors("Azure", uniqueReportingErrors);
    },

    /**
     * Gets the test point IDs for all tests of rootSuite.
     * The title of a test is added to the unreportedTestTitles array, if there was an error or if no test point exists for that test.
     * @param rootSuite 
     * @returns An array containing all existing test point IDs for all tests of rootSuite.
     */
    async getPointIds(rootSuite: Suite) {
        const pointIds = [];
        for (const test of rootSuite.allTests()) {
            let _testId;
            let _projectConfiguration;
            try {
                _testId = testUtils.id(test);
                _projectConfiguration = testUtils.projectConfiguration(test, configurationNames);
            } catch {
                unreportedTestTitles.push(test.title);
                continue;
            }
            let reported = false;
            for (const suiteId of suiteIds) {
                const testPointId = await plansSteps.getTestPointId(planId, suiteId, parseInt(_testId), _projectConfiguration);
                if (testPointId) {
                    pointIds.push(testPointId);
                    reported = true;
                }
            }
            if (!reported)
                unreportedTestTitles.push(test.title);
        }
        return pointIds;
    },

    /**
     * Creates a test run.
     * @param runDetails  
     * @returns The error message, if there was an error. Otherwise, the test run ID.
     */
    async createRunAndCatchUserError(runDetails: RunDetails) {
        const runIdAndUserError = await runsSteps.createRunAndCatchUserError(runDetails);
        return runIdAndUserError;
    },

    /**
     * Updates the test run.
     * @param runId 
     * @param runDetails 
     */
    async updateRun(runId: number, runDetails: RunDetails) {
        await runsSteps.updateRun(runId, runDetails);
    }
};

export default azureReportHelper;