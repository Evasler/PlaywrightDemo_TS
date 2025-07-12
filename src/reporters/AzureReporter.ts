import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter";
import azureReportHelper from "../helpers/reporting/AzureReportHelper";
import { AzureReporterOptions, RunDetails } from "../customTypes/FrameworkTypes";
import GlobalReporter from "./GlobalReporter";
import errorHandlingUtils from "../utils/ErrorHandlingUtils";

export default class AzureReporter implements Reporter {

    private _runId?: number;
    private _runDetails!: RunDetails;

    constructor(private readonly _options: AzureReporterOptions) {
        this._throwOptionTypeErrors();
    }

    /**
     * Checks if all of AzureReporter's options inside playwright.config are defined properly.
     */
    private _throwOptionTypeErrors() {
        const optionTypeErrors = [
            ...this._optionTypeErrors("enabled", "boolean"),
            ...this._optionTypeErrors("mandatoryReporting", "boolean"),
            ...this._optionTypeErrors("azureBaseUrl", "string"),
            ...this._optionTypeErrors("organizationName", "string"),
            ...this._optionTypeErrors("projectName", "string"),
            ...this._optionTypeErrors("personalAccessToken", "string"),
            ...this._optionTypeErrors("runName", "string"),
            ...this._optionTypeErrors("planId", "number"),
            ...this._optionTypeErrors("suiteIds", "number[]"),
            ...this._optionTypeErrors("configurationNames", "string[]")
        ];
        if (optionTypeErrors.length > 0)
            errorHandlingUtils.reportErrors("Azure", optionTypeErrors);
    }

    /**
     * @param optionName 
     * @param expectedPropertyType 
     * @returns An array containing the error message, if the option was not defined properly. Otherwise, an empty array.
     */
    private _optionTypeErrors(optionName: keyof AzureReporterOptions, expectedPropertyType: string) {
        const optionTypeErrors = [];
        const _expectedPropertyType = Array.isArray(this._options[optionName]) ? "object" : expectedPropertyType;
        if (typeof this._options[optionName] === _expectedPropertyType) {
            if (Array.isArray(this._options[optionName]))
                if (this._options[optionName].length === 0)
                    optionTypeErrors.push(`Value of option \"${optionName}\" in playwright.config should be an array with at least 1 item`);
                else {
                    const expectedArrayType = expectedPropertyType.replace("[]", "");
                    for (const item of this._options[optionName])
                        if (typeof item !== expectedArrayType)
                            optionTypeErrors.push(`Value \"${item}\" of option \"${optionName}\" in playwright.config should be of type ${expectedArrayType}`);
                }
        } else
            optionTypeErrors.push(`Value \"${this._options[optionName]}\" of option \"${optionName}\" in playwright.config should be of type ${expectedPropertyType}`);
        return optionTypeErrors;
    }
    
    /**
     * Before the execution, if reporting is enabled, a Test Run is created on Azure.
     * If reporting is mandatory and errors occur, they are printed and the execution is stopped.
     * @param config 
     * @param rootSuite 
     */
    onBegin(config: FullConfig, rootSuite: Suite): void {
        if (this._options.enabled) {
            const projectBaseUrl = encodeURI(`${this._options.azureBaseUrl}${this._options.organizationName}/${this._options.projectName}/`);
            azureReportHelper.init(
                {
                    projectBaseUrl: projectBaseUrl,
                    personalAccessToken: this._options.personalAccessToken,
                    planId: this._options.planId,
                    suiteIds: this._options.suiteIds,
                    configurationNames: this._options.configurationNames
                }
            );
            GlobalReporter.addReportingStep(async() => await azureReportHelper.openAuthorizedContext());
            if (this._options.mandatoryReporting)
                GlobalReporter.addReportingStep(async() => { await azureReportHelper.throwReportingErrors(rootSuite); } );
            GlobalReporter.addReportingStep(async() => {
                const pointIds = await azureReportHelper.getPointIds(rootSuite);
                if (pointIds.length > 0) {
                    this._runDetails = {
                        name: this._options.runName,
                        automated: true,
                        plan: { id: this._options.planId },
                        pointIds: pointIds,
                        state: "Waiting",
                        startedDate: new Date(Date.now()).toISOString(),
                        completedDate: undefined
                    };
                    const runIdOrError = await azureReportHelper.createRunAndCatchUserError(this._runDetails);
                    if (this._options.mandatoryReporting && typeof runIdOrError === "string") {
                        errorHandlingUtils.reportErrors("Azure", [runIdOrError]);
                    } else if (typeof runIdOrError === "number")
                        this._runId = runIdOrError;
                }
            });
        }
    }

    /**
     * At the end of the test, if reporting is enabled, its result is updated in Azure's Test Run.
     * @param test 
     * @param result 
     */
    onTestEnd(test: TestCase, result: TestResult): void {
        if (this._options.enabled)
            GlobalReporter.addReportingStep(async() => {
                if (this._runId)
                    await azureReportHelper.updateResult(this._runId, test, result);
            });
    }

    /**
     * At the end of the execution, if reporting is enabled, Azure's Test Run's state is updated.
     * A list of the tests, which were not reported, is printed.
     * @param result 
     */
    onEnd(result: FullResult): Promise<{ status?: FullResult["status"]; } | undefined | void> | void {
        GlobalReporter.addReportingStep(async() => {
            if (this._options.enabled) {
                if (this._runId) {
                    this._runDetails.startedDate = result.startTime.toISOString();
                    const completedDate = new Date();
                    completedDate.setTime(result.startTime.getTime() + result.duration);
                    this._runDetails.completedDate = completedDate.toISOString();
                    switch(result.status) {
                        case "passed":
                            this._runDetails.state = "Completed";
                            break;
                        case "failed":
                        case "timedout":
                            this._runDetails.state = "NeedsInvestigation";
                            break;
                        case "interrupted":
                            this._runDetails.state = "Aborted";
                            break;
                    }
                    await azureReportHelper.updateRun(this._runId, this._runDetails);
                }
                azureReportHelper.printUnreportedTestResultsWarning();
            }
        });
    }
}