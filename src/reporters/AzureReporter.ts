import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter";
import AzureReportHelper from "../helpers/AzureReportHelper";
import { AzureReporterOptions, RunDetails } from "../customTypes/FrameworkTypes";
import GlobalReporter from "./GlobalReporter";
import TerminalUtils from "../utils/TerminalUtils";

export default class AzureReporter implements Reporter {

    private _azureReportHelper!: AzureReportHelper;

    private _runId: number | undefined = undefined;
    private _runDetails!: RunDetails;

    constructor(private readonly _options: AzureReporterOptions) {
        this._throwOptionTypeErrors();
    }

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
        if (optionTypeErrors.length > 0) {
            TerminalUtils.printColoredText("Azure:", "red");
            for (const optionTypeError of optionTypeErrors)
                TerminalUtils.printColoredText(`  ${optionTypeError}`, "red");
            process.exit();
        }
    }

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
    
    onBegin(config: FullConfig, rootSuite: Suite): void {
        if (this._options.enabled) {
            const projectBaseUrl = encodeURI(`${this._options.azureBaseUrl}${this._options.organizationName}/${this._options.projectName}/`);
            this._azureReportHelper = new AzureReportHelper(
                projectBaseUrl,
                this._options.personalAccessToken,
                this._options.planId,
                this._options.suiteIds,
                this._options.configurationNames
            );
            GlobalReporter.addReportingStep(async() => await this._azureReportHelper.createAuthorizedContext());
            if (this._options.mandatoryReporting)
                GlobalReporter.addReportingStep(async() => { await this._azureReportHelper.throwReportingErrors(rootSuite); } );
            GlobalReporter.addReportingStep(async() => {
                const pointIds = await this._azureReportHelper.getPointIds(rootSuite);
                if (pointIds.length > 0) {
                    this._runDetails = {
                        name: this._options.runName,
                        automated: true,
                        plan: { id: this._options.planId },
                        pointIds: pointIds,
                        state: "Waiting",
                        startedDate: new Date(Date.now()).toISOString()
                    };
                    const runIdAndUserError = await this._azureReportHelper.createRunAndCatchUserError(this._runDetails);
                    if (this._options.mandatoryReporting && runIdAndUserError.userError) {
                        TerminalUtils.printColoredText(runIdAndUserError.userError, "red");
                        process.exit();
                    } else
                        this._runId = runIdAndUserError.runId;
                }
            });
        }
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        if (this._options.enabled)
            GlobalReporter.addReportingStep(async() => {
                if (this._runId)
                    await this._azureReportHelper.updateResult(this._runId, test, result);
            });
    }

    onEnd(result: FullResult): Promise<{ status?: FullResult["status"]; } | undefined | void> | void {
        GlobalReporter.addReportingStep(async() => {
            if (this._options.enabled) {
                if (this._runId) {
                    this._runDetails.startedDate = result.startTime.toISOString();
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
                    await this._azureReportHelper.updateRun(this._runId, this._runDetails);
                }
                this._azureReportHelper.printUnreportedTestResultsWarning();
            }
        });
    }
}