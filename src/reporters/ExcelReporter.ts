import type {
  FullConfig,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";
import type { ExcelReporterOptions } from "../types/index.js";
import GlobalReporter from "./GlobalReporter.js";
import { errorHandlingUtils, testUtils } from "../utils/index.js";
import excelReportHelper from "../helpers/reporting/excelReportHelper.js";

/**
 * Reporter that manages test result reporting to Excel workbooks.
 *
 * This reporter updates test results in a predefined Excel file structure,
 * validating configuration options and ensuring proper worksheet setup.
 */
export default class ExcelReporter implements Reporter {
  /**
   * Initialize the Excel reporter with the provided options from playwright.config
   * @param _options Configuration options for the Excel reporter
   */
  constructor(private readonly _options: ExcelReporterOptions) {
    testUtils.setReporterStatus({
      excelReporterStatus: this._options.enabled ? "pending" : "ready",
    });
    this._throwOptionErrors();
  }

  /**
   * Validates that all required options for the Excel reporter are defined with correct types.
   * Reports errors if any options are missing or have incorrect types.
   */
  private _throwOptionErrors() {
    const optionTypeErrors = [
      ...this._optionTypeErrors("enabled", "boolean"),
      ...this._optionTypeErrors("mandatoryReporting", "boolean"),
      ...this._optionTypeErrors("filepath", "string"),
      ...this._optionTypeErrors("configurationNames", "string[]"),
    ];
    if (optionTypeErrors.length > 0)
      errorHandlingUtils.reportErrors("Excel", optionTypeErrors);
  }

  /**
   * Validates the type of a specific option and returns any errors.
   * @param optionName The name of the option to validate
   * @param expectedPropertyType The expected type of the option
   * @returns Array of error messages if validation fails, otherwise an empty array
   */
  private _optionTypeErrors(
    optionName: keyof ExcelReporterOptions,
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
            `Option "${optionName}" in playwright.config should include at least 1 value`,
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
   * If reporting is enabled, initializes Excel reporting and validates file structure.
   * If reporting is mandatory and errors occur, they are reported and execution is stopped.
   * @param config Playwright full configuration
   * @param rootSuite The root suite containing all test cases
   */
  onBegin(config: FullConfig, rootSuite: Suite): void {
    if (this._options.enabled) {
      excelReportHelper.init({
        filepath: this._options.filepath,
        configurationNames: this._options.configurationNames,
      });
      if (this._options.mandatoryReporting)
        GlobalReporter.addReportingStep(async () => {
          await excelReportHelper.throwReportingErrors(rootSuite);
        });
      GlobalReporter.addReportingStep(() => {
        testUtils.setReporterStatus({ excelReporterStatus: "ready" });
      });
    }
  }

  /**
   * Called when a test ends.
   * If reporting is enabled, updates the test result in the Excel report.
   * @param test The test that has ended
   * @param result The result of the test
   */
  onTestEnd(test: TestCase, result: TestResult): void {
    GlobalReporter.addReportingStep(async () => {
      if (this._options.enabled)
        await excelReportHelper.updateResult(test, result);
    });
  }

  /**
   * Called at the end of the test run.
   * If reporting is enabled, prints warnings for any tests that couldn't be reported.
   */
  onEnd() {
    GlobalReporter.addReportingStep(() => {
      if (this._options.enabled)
        excelReportHelper.printUnreportedTestResultsWarning();
    });
  }
}
