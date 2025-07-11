import { Suite, TestCase, TestResult } from "@playwright/test/reporter";
import { request } from "@playwright/test";
import TerminalUtils from "../../utils/TerminalUtils";
import TestUtils from "../../utils/TestUtils";
import ErrorHandlingUtils from "../../utils/ErrorHandlingUtils";
import { APIRequestContext } from "@playwright/test";
import RunsSteps from "../../azureServices/Test/Runs/RunsSteps";
import PlansSteps from "../../azureServices/Test/Plans/PlansSteps";
import { ResultDetails, RunDetails } from "../../customTypes/FrameworkTypes";

/**
 * Facilitates all Azure actions performed by AzureReporter.
 */
export default class AzureReportHelper {

    private readonly _unreportedTestTitles: string[] = [];
    private _authorizedContext!: APIRequestContext;
    private _runsSteps!: RunsSteps;
    private _plansSteps!: PlansSteps;

    constructor(
        private readonly _projectBaseUrl: string,
        private readonly _personalAccessToken: string, 
        private readonly _planId: number,
        private readonly _suiteIds: number[],
        private readonly _configurations: string[]
    ) { }

    /**
     * Opens a new Request Context, which is authorized to perform API calls to Azure.
     */
    async openAuthorizedContext() {
        this._authorizedContext = await request.newContext({
            extraHTTPHeaders: {
                Authorization: 'Basic ' + Buffer.from(`:${this._personalAccessToken}`).toString('base64')
            }
        });
        this._runsSteps = new RunsSteps(this._authorizedContext, this._projectBaseUrl);
        this._plansSteps = new PlansSteps(this._authorizedContext, this._projectBaseUrl);
    }

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
            _testId = TestUtils.id(test);
            _projectConfiguration = TestUtils.projectConfiguration(test, this._configurations);
        } catch(error) {
            return;
        }
        if (!this._unreportedTestTitles.includes(_testId)) {
            for (const suiteId of this._suiteIds) {
                const testPointId = await this._plansSteps.getTestPointId(this._planId, suiteId, parseInt(_testId), _projectConfiguration);
                if (!testPointId)
                    return;
                const testResultId = await this._runsSteps.getResultId(runId, String(testPointId));
                if (!testResultId)
                    return;
                const outcome = result.status === "passed" ? "Passed" : (result.status === 'skipped' ? "NotExecuted" : "Failed");
                const testResultDetails: ResultDetails = {
                    id: testResultId,
                    outcome: outcome,
                    state: "Completed",
                    startedDate: result.startTime.toISOString(),
                    durationInMs: result.duration,
                    errorMessage: result.error?.message ? TerminalUtils.clearOutput(result.error.message) : undefined
                }
                await this._runsSteps.updateResult(runId, testResultDetails)
            }
        }
    }
    
    /**
     * Lists the title of all tests, which weren't reported.
     */
    printUnreportedTestResultsWarning() {
        if (this._unreportedTestTitles.length > 0)
            ErrorHandlingUtils.reportWarnings("Azure", this._unreportedTestTitles.map(title => `Test result not reported: ${title}`));
    }

    /**
     * Gets a Test Point by Test Case ID.
     * @param test 
     * @returns An array containing the error message, if there was an error. Otherwise, an empty array.
     */
    private async _requestErrors(test: TestCase) {
        let _testId;
        try {
            _testId = TestUtils.id(test);
            for (const suiteId of this._suiteIds) {
                const requestError = await this._plansSteps.getRequestError(this._planId, suiteId, parseInt(_testId));
                if (requestError)
                    return [ requestError ];
            }
            return [];
        } catch(error) {
            return [];
        }
    }

    /**
     * Gets the configurations specified by projectName.
     * @param projectName 
     * @returns An array containing the error message, if there was an error. Otherwise, an empty array.
     */
    private _projectErrors(projectName: string) {
        const projectErrors = [];
        if (this._configurations) {
            const projectConfigurations = this._configurations.filter(configuration => projectName.includes(configuration));
            if (this._configurations.length > 0)
                if (projectConfigurations.length === 0)
                    projectErrors.push(`Project \"${projectName}\" does not specify the configuration (${this._configurations.join("|")})`);
                else if (projectConfigurations.length > 1)
                    projectErrors.push(`Project \"${projectName}\" specifies multiple configurations (${this._configurations.join("|")})`);
        }
        return projectErrors;
    }
    
    /**
     * Checks if a test point exists.
     * @param test 
     * @param projectName 
     * @param requestWasSuccessful 
     * @returns An array containing the error message, if there was an error or if the test point doesn't exist. Otherwise, an empty array.
     */
    private async _testErrors(test: TestCase, projectName: string, requestWasSuccessful: boolean) {
        const titleErrors: string[] = [];
        const testPointErrors: string[] = [];

        if (!test.title.includes(":"))
            titleErrors.push(`Title \"${test.title}\" should include a ":"`);
        const testId = test.title.substring(0, test.title.indexOf(":"));
        if (titleErrors.length === 0 && !/\d+/.test(testId))
            titleErrors.push(`TestId \"${testId}\" should be a number`);

        if (this._configurations && requestWasSuccessful) {
            const projectConfigurations = this._configurations.filter(configuration => projectName.includes(configuration));
            if (titleErrors.length === 0 && projectConfigurations.length === 1)
                if (!await this._testPointExists(test))
                    testPointErrors.push(`Test Point [${testId},${projectConfigurations[0]}] not found in ${this._suiteIds.length > 1 ? "Suites" : "Suite"} ${this._suiteIds.join(",")} of Plan ${this._planId}`);
        }
        return [...titleErrors, ...testPointErrors];
    }

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
            const projectName = projectSuite.project()!.name;
            projectErrors.push(...this._projectErrors(projectName));
            for (const test of projectSuite.allTests()) {
                if (requestErrors.length === 0)
                    requestErrors.push(...await this._requestErrors(test));
                testErrors.push(...await this._testErrors(test, projectName, requestErrors.length === 0));
            }
        }
        const uniqueReportingErrors = [...new Set([...requestErrors, ...projectErrors, ...testErrors])];
        if (uniqueReportingErrors.length > 0)
            ErrorHandlingUtils.reportErrors("Azure", uniqueReportingErrors);
    }
    
    /**
     * @param test 
     * @returns False if there was an error or if the test point doesn't exist. Otherwise, true.
     */
    private async _testPointExists(test: TestCase) {
        let _testId;
        let _projectConfiguration
        try {
            _testId= TestUtils.id(test);
            _projectConfiguration = TestUtils.projectConfiguration(test, this._configurations);
            for (const suiteId of this._suiteIds) {
                const testPointId = await this._plansSteps.getTestPointId(this._planId, suiteId, parseInt(_testId), _projectConfiguration);
                if (testPointId)
                    return true;
            }
            return false;
        } catch(error) {
            return false;
        }
    }

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
                _testId = TestUtils.id(test);
                _projectConfiguration = TestUtils.projectConfiguration(test, this._configurations);
            } catch(error) {
                this._unreportedTestTitles.push(test.title);
                continue;
            }
            let reported = false;
            for (const suiteId of this._suiteIds) {
                const testPointId = await this._plansSteps.getTestPointId(this._planId, suiteId, parseInt(_testId), _projectConfiguration);
                if (testPointId) {
                    pointIds.push(testPointId);
                    reported = true;
                }
            }
            if (!reported)
                this._unreportedTestTitles.push(test.title);
        }
        return pointIds;
    }

    /**
     * Creates a test run.
     * @param runDetails  
     * @returns The error message, if there was an error. Otherwise, the test run ID.
     */
    async createRunAndCatchUserError(runDetails: RunDetails) {
        const runIdAndUserError = await this._runsSteps.createRunAndCatchUserError(runDetails);
        return runIdAndUserError;
    }

    /**
     * Updates the test run.
     * @param runId 
     * @param runDetails 
     */
    async updateRun(runId: number, runDetails: RunDetails) {
        await this._runsSteps.updateRun(runId, runDetails);
    }
}