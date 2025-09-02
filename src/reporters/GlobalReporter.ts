import type { Reporter } from "@playwright/test/reporter";

/**
 * Reporter that coordinates the execution order of reporting operations.
 *
 * This reporter implements a promise chain pattern to ensure that all reporting
 * operations from other reporters are executed sequentially.
 */
export default class GlobalReporter implements Reporter {
  /**
   * A promise chain that ensures all reporting steps are executed sequentially.
   * This static property is shared across all reporter instances.
   */
  private static _reportingSteps = Promise.resolve();

  /**
   * Adds a reporting step to the global promise chain.
   *
   * This static method allows other reporters to add their operations to the promise chain,
   * ensuring they will be executed in sequence after any previously added steps complete.
   *
   * @param reportingStep - A function that performs a reporting operation
   */
  static addReportingStep(reportingStep: () => void | Promise<void>) {
    this._reportingSteps = this._reportingSteps.then(reportingStep);
  }

  /**
   * Called by Playwright at the end of the test run to ensure all reporting is complete.
   *
   * This method is called automatically by Playwright before the process exits,
   * and it waits for all reporting steps in the promise chain to complete.
   *
   * @returns A promise that resolves when all reporting steps have completed
   */
  onExit(): Promise<void> {
    return GlobalReporter._reportingSteps;
  }
}
