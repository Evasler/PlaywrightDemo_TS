import type { Reporter } from "@playwright/test/reporter";

/**
 * Ensures that the operations from all other reporters are executed sequentially.
 */
export default class GlobalReporter implements Reporter {

    private static _reportingSteps = Promise.resolve();

    /**
     * Adds a step to the reportingSteps promise.
     * @param reportingStep 
     */
    static addReportingStep(reportingStep: () => void | Promise<void>) {
        this._reportingSteps = this._reportingSteps.then(reportingStep);
    }

    /**
     * Before exiting, the reportingSteps promise will be awaited.
     * @returns 
     */
    onExit(): Promise<void> {
        return GlobalReporter._reportingSteps;
    }
}