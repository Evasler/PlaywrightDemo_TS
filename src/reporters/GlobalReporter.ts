import { Reporter } from "@playwright/test/reporter";

export default class GlobalReporter implements Reporter {

    private static _reportingSteps = Promise.resolve();

    static addReportingStep(reportingStep: () => void | Promise<void>) {
        this._reportingSteps = this._reportingSteps.then(reportingStep);
    }

    onExit(): Promise<void> {
        return GlobalReporter._reportingSteps;
    }
}