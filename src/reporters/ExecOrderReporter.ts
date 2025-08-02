import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
} from "@playwright/test/reporter";
import { terminalUtils } from "../utils/index.js";

export default class MyReporter implements Reporter {
  private _testId = 1;
  private _testCount = 0;

  constructor() {
    console.log("\n");
    terminalUtils.printHeader();
    terminalUtils.printLogLevelMessage(
      import.meta.filename,
      "customReporter",
      "reporter",
      "constructor",
    );
  }

  onBegin(config: FullConfig, suite: Suite) {
    this._testCount = suite.allTests().length;
    terminalUtils.printLogLevelMessage(
      import.meta.filename,
      "customReporter",
      "reporter",
      "onBegin",
    );
  }

  onTestBegin(test: TestCase) {
    const project = test.parent.project();
    console.log(
      `(${this._testId++}/${this._testCount}) ${project ? project.name : "projectlessSuite"} > ${test.title}`,
    );
    terminalUtils.printLogLevelMessage(
      import.meta.filename,
      "customReporter",
      "reporter",
      "onTestBegin",
    );
  }

  // Commented-out due to extreme noise
  // onStepBegin(test: TestCase, result: TestResult, step: TestStep) {
  //   terminalUtils.printLogLevelMessage(import.meta.filename, "", "reporter", "onStepBegin");
  // }

  // Commented-out due to extreme noise
  // onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
  //   terminalUtils.printLogLevelMessage(import.meta.filename, "", "reporter", "onStepEnd");
  // }

  onTestEnd() {
    terminalUtils.printLogLevelMessage(
      import.meta.filename,
      "customReporter",
      "reporter",
      "onTestEnd",
    );
  }

  onEnd() {
    terminalUtils.printLogLevelMessage(
      import.meta.filename,
      "customReporter",
      "reporter",
      "onEnd",
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async onExit(): Promise<void> {
    terminalUtils.printLogLevelMessage(
      import.meta.filename,
      "customReporter",
      "reporter",
      "onExit",
    );
    console.log("\n");
  }

  onStdOut(chunk: string | Buffer): void {
    console.log(chunk.toString().trim());
  }
}
