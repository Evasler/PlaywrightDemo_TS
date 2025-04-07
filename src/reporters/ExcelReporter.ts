import type { FullConfig, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { ExcelReporterOptions } from '../customTypes/FrameworkTypes';
import ExcelReportHelper from '../helpers/ExcelReportHelper';
import GlobalReporter from './GlobalReporter';
import TerminalUtils from '../utils/TerminalUtils';

export default class ExcelReporter implements Reporter {

    private _excelReportHelper: ExcelReportHelper;

    constructor(private readonly _options: ExcelReporterOptions) {
        this.throwOptionErrors();
        this._excelReportHelper = new ExcelReportHelper(this._options.filepath, this._options.configurations);
    }
    
    private throwOptionErrors() {
        const optionTypeErrors = [
            ...this.optionTypeErrors("enabled", "boolean"),
            ...this.optionTypeErrors("mandatoryReporting", "boolean"),
            ...this.optionTypeErrors("filepath", "string"),
            ...this.optionTypeErrors("configurations", "string[]")
        ];
        if (optionTypeErrors.length > 0) {
            TerminalUtils.printColoredText("Excel:", "red");
            for (const optionTypeError of optionTypeErrors)
                TerminalUtils.printColoredText(`  ${optionTypeError}`, "red");
            process.exit();
        }
    }

    private optionTypeErrors(optionName: keyof ExcelReporterOptions, expectedPropertyType: string) {
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

    onBegin(config: FullConfig, rootSuite: Suite): void {
        if (this._options.enabled && this._options.mandatoryReporting)
            GlobalReporter.addReportingStep(async() => { await this._excelReportHelper.throwReportingErrors(rootSuite); });
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        GlobalReporter.addReportingStep(async () => {
            if (this._options.enabled)
                await this._excelReportHelper.updateResult(test, result);
        });
    }

    onEnd() {
        GlobalReporter.addReportingStep(() => {
            if (this._options.enabled)
                this._excelReportHelper.printUnreportedTestResultsWarning();
        });
    }
}