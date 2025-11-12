import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";
import GlobalReporter from "./GlobalReporter.js";
import { errorHandlingUtils } from "../utils/index.js";
import azureReportHelper from "../helpers/reporting/azureReportHelper.js";
import type { RunDetails } from "../external/azure/types.js";
import type { AzureReporterOptions } from "../types/index.js";
import { env } from "process";

/**
 * Reporter for sending test results to Azure DevOps.
 * Creates a test run in Azure DevOps and updates test case results.
 */
export default class AzureReporter implements Reporter {
  /** ID of the test run in Azure DevOps */
  private _runId?: number;
  /** Details of the test run in Azure DevOps */
  private _runDetails!: RunDetails;
  private readonly _options: AzureReporterOptions;

  /**
   * Initialize the Azure reporter with the provided options from playwright.config
   * @param _options Configuration options for the Azure reporter
   */
  constructor(options: AzureReporterOptions) {
    this._options = options;
    this._throwOptionTypeErrors();
    env.AZURE_VALIDATION = this._options.enabled ? "initializing" : "ok";
  }

  /**
   * Validates that all required options for the Azure reporter are defined with correct types.
   * Reports errors if any options are missing or have incorrect types.
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
      ...this._optionTypeErrors("configurationNames", "string[]"),
    ];
    if (optionTypeErrors.length > 0)
      errorHandlingUtils.reportErrors("Azure", optionTypeErrors);
  }

  /**
   * Validates the type of a specific option and returns any errors.
   * @param optionName The name of the option to validate
   * @param expectedPropertyType The expected type of the option
   * @returns Array of error messages if validation fails, otherwise an empty array
   */
  private _optionTypeErrors(
    optionName: keyof AzureReporterOptions,
    expectedPropertyType: string,
  ) {
    const optionTypeErrors = [];
    const _expectedPropertyType = Array.isArray(this._options[optionName])
      ? "object"
      : expectedPropertyType;
    if (typeof this._options[optionName] === _expectedPropertyType) {
      if (Array.isArray(this._options[optionName]))
        if (this._options[optionName].length === 0)
          optionTypeErrors.push(
            `Value of option "${optionName}" in playwright.config should be an array with at least 1 item`,
          );
        else {
          const expectedArrayType = expectedPropertyType.replace("[]", "");
          for (const item of this._options[optionName])
            if (typeof item !== expectedArrayType)
              optionTypeErrors.push(
                `Value "${item}" of option "${optionName}" in playwright.config should be of type ${expectedArrayType}`,
              );
        }
    } else
      optionTypeErrors.push(
        `Value "${String(this._options[optionName])}" of option "${optionName}" in playwright.config should be of type ${expectedPropertyType}`,
      );
    return optionTypeErrors;
  }

  /**
   * Called at the beginning of the test run.
   * If reporting is enabled, initializes Azure connection and creates a test run.
   * If reporting is mandatory and errors occur, they are reported and execution is stopped.
   * @param config Playwright full configuration
   * @param rootSuite The root suite containing all test cases
   */
  onBegin(config: FullConfig, rootSuite: Suite): void {
    if (this._options.enabled) {
      const projectBaseUrl = encodeURI(
        `${this._options.azureBaseUrl}${this._options.organizationName}/${this._options.projectName}/`,
      );
      azureReportHelper.init({
        projectBaseUrl: projectBaseUrl,
        personalAccessToken: this._options.personalAccessToken,
        planId: this._options.planId,
        suiteIds: this._options.suiteIds,
        configurationNames: this._options.configurationNames,
      });
      GlobalReporter.addReportingStep(async () => {
        await azureReportHelper.openAuthorizedContext();
      });
      if (this._options.mandatoryReporting)
        GlobalReporter.addReportingStep(async () => {
          await azureReportHelper.throwReportingErrors(rootSuite);
        });
      GlobalReporter.addReportingStep(async () => {
        const pointIds = await azureReportHelper.getPointIds(rootSuite);
        if (pointIds.length > 0) {
          this._runDetails = {
            name: this._options.runName,
            automated: true,
            plan: { id: this._options.planId },
            pointIds: pointIds,
            state: "Waiting",
            startedDate: new Date(Date.now()).toISOString(),
            completedDate: undefined,
          };
          const runIdOrError =
            await azureReportHelper.createRunAndCatchUserError(
              this._runDetails,
            );
          if (
            this._options.mandatoryReporting &&
            typeof runIdOrError === "string"
          ) {
            errorHandlingUtils.reportErrors("Azure", [runIdOrError]);
          } else if (typeof runIdOrError === "number")
            this._runId = runIdOrError;
        }
      });
      GlobalReporter.addReportingStep(() => {
        env.AZURE_VALIDATION = "ok";
      });
    }
  }

  /**
   * Called when a test ends.
   * If reporting is enabled, updates the test result in Azure DevOps.
   * @param test The test that has ended
   * @param result The result of the test
   */
  onTestEnd(test: TestCase, result: TestResult): void {
    if (this._options.enabled)
      GlobalReporter.addReportingStep(async () => {
        if (this._runId)
          await azureReportHelper.updateResult(this._runId, test, result);
      });
  }

  /**
   * Called at the end of the test run.
   * If reporting is enabled, updates the Azure Test Run state and prints warnings about unreported tests.
   * @param result The overall result of the test run
   */
  onEnd(result: FullResult) {
    GlobalReporter.addReportingStep(async () => {
      if (this._options.enabled) {
        if (this._runId) {
          this._runDetails.startedDate = result.startTime.toISOString();
          const completedDate = new Date();
          completedDate.setTime(result.startTime.getTime() + result.duration);
          this._runDetails.completedDate = completedDate.toISOString();
          switch (result.status) {
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
