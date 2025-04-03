import type { FullConfig, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { ExcelReporterOptions } from '../customTypes/FrameworkTypes';
import { ExcelReportHelper } from '../helpers/ExcelReportHelper';
import GlobalReporter from './GlobalReporter';

export default class ExcelReporter implements Reporter {

    private _excelReportHelper: ExcelReportHelper;

    constructor(private readonly _options: ExcelReporterOptions) {
        this._excelReportHelper = new ExcelReportHelper(this._options.filepath, this._options.configurations);
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