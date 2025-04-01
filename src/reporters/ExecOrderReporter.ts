import type { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult, TestStep } from '@playwright/test/reporter';
import { TerminalUtils } from '../utils/TerminalUtils';

export default class MyReporter implements Reporter {

  private _testId = 1;
  private _testCount: number = 0;

  constructor() {
    console.log('\n');
    TerminalUtils.printHeader();
    TerminalUtils.printLogLevelMessage(__filename, "customReporter", "reporter", "constructor");
  }

  onBegin(config: FullConfig, suite: Suite) {
    this._testCount = suite.allTests().length;
    TerminalUtils.printLogLevelMessage(__filename, "customReporter", "reporter", "onBegin");
  }

  onTestBegin(test: TestCase) {
    console.log(`(${this._testId++}/${this._testCount}) ${test.parent.project()!.name} > ${test.title}`)
    TerminalUtils.printLogLevelMessage(__filename, "customReporter", "reporter", "onTestBegin");
  }

  // Commented-out due to extreme noise
  // onStepBegin(test: TestCase, result: TestResult, step: TestStep) {
  //   TerminalUtils.printLogLevelMessage(__filename, "", "reporter", "onStepBegin");
  // }

  // Commented-out due to extreme noise
  // onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
  //   TerminalUtils.printLogLevelMessage(__filename, "", "reporter", "onStepEnd");
  // }

  onTestEnd(test: TestCase, result: TestResult) {
    TerminalUtils.printLogLevelMessage(__filename, "customReporter", "reporter", "onTestEnd");
  }

  onEnd(result: FullResult) {
    TerminalUtils.printLogLevelMessage(__filename, "customReporter", "reporter", "onEnd");
  }

  async onExit(): Promise<void> {
    TerminalUtils.printLogLevelMessage(__filename, "customReporter", "reporter", "onExit");
    console.log('\n');
  }

  onStdOut(chunk: string | Buffer, test: void | TestCase, result: void | TestResult): void {
    console.log(chunk.toString().trim());
  }
}