import type { FullConfig, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { ExcelReporterOptions } from '../customTypes/FrameworkTypes';
import { ExcelReportHelper } from '../helpers/ExcelReportHelper';

export default class ExcelReporter implements Reporter {

    private _excelReportHelper: ExcelReportHelper;
    private _updateResults = Promise.resolve();

    constructor(private readonly _options: ExcelReporterOptions) {
        this._excelReportHelper = new ExcelReportHelper(this._options.filepath, this._options.configurations);
    }

    onBegin(config: FullConfig, rootSuite: Suite): void {
        if (this._options.enabled && this._options.mandatoryReporting)
            this._updateResults = this._updateResults.then(async() => { await this._excelReportHelper.throwReportingErrors(rootSuite); });
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        this._updateResults = this._updateResults.then(async () => {
            if (this._options.enabled)
                await this._excelReportHelper.updateResult(test, result);
        });
    }

    onEnd() {
        this._updateResults = this._updateResults.then(() => {
            if (this._options.enabled)
                this._excelReportHelper.printUnreportedTestResultsWarning();
        });
        return this._updateResults;
    }
}