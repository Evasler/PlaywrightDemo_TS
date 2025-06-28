import type { FullConfig, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { ExcelReporterOptions } from '../customTypes/FrameworkTypes';
import ExcelReportHelper from '../helpers/reporting/ExcelReportHelper';
import GlobalReporter from './GlobalReporter';
import ErrorHandlingUtils from '../utils/ErrorHandlingUtils';

export default class ExcelReporter implements Reporter {

    private _excelReportHelper: ExcelReportHelper;

    constructor(private readonly _options: ExcelReporterOptions) {
        this._throwOptionErrors();
        this._excelReportHelper = new ExcelReportHelper(this._options.filepath, this._options.configurations);
    }

    /**
     * Checks if all of ExcelReporter's options inside playwright.config are defined properly.
     */
    private _throwOptionErrors() {
        const optionTypeErrors = [
            ...this._optionTypeErrors("enabled", "boolean"),
            ...this._optionTypeErrors("mandatoryReporting", "boolean"),
            ...this._optionTypeErrors("filepath", "string"),
            ...this._optionTypeErrors("configurations", "string[]")
        ];
        if (optionTypeErrors.length > 0)
            ErrorHandlingUtils.reportErrors("Excel", optionTypeErrors);
    }

    /**
     * @param optionName 
     * @param expectedPropertyType 
     * @returns An array containing the error message, if the option was not defined properly. Otherwise, an empty array.
     */
    private _optionTypeErrors(optionName: keyof ExcelReporterOptions, expectedPropertyType: string) {
        const optionTypeErrors = [];
        const _expectedPropertyType = Array.isArray(this._options[optionName]) ? "object" : expectedPropertyType;
        if (typeof this._options[optionName] === _expectedPropertyType) {
            if (Array.isArray(this._options[optionName]))
                if (this._options[optionName].length === 0)
                    optionTypeErrors.push(`Option \"${optionName}\" in playwright.config should include at least 1 value`);
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
     * Before the execution, if reporting is enabled and mandatory and errors occur, they are printed and the execution is stopped.
     * @param config 
     * @param rootSuite 
     */
    onBegin(config: FullConfig, rootSuite: Suite): void {
        if (this._options.enabled && this._options.mandatoryReporting)
            GlobalReporter.addReportingStep(async() => { await this._excelReportHelper.throwReportingErrors(rootSuite); });
    }

    /**
     * At the end of the test, if reporting is enabled, its result is updated in the Excel report.
     * @param test 
     * @param result 
     */
    onTestEnd(test: TestCase, result: TestResult): void {
        GlobalReporter.addReportingStep(async () => {
            if (this._options.enabled)
                await this._excelReportHelper.updateResult(test, result);
        });
    }

    /**
     * At the end of the execution, if reporting is enabled, Azure's Test Run's state is updated.
     * A list of the tests, which were not reported, is printed.
     */
    onEnd() {
        GlobalReporter.addReportingStep(() => {
            if (this._options.enabled)
                this._excelReportHelper.printUnreportedTestResultsWarning();
        });
    }
}