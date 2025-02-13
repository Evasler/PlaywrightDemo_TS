import type { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult, TestStep, TestError } from '@playwright/test/reporter';

export default class MyReporter implements Reporter {

  private testId = 1;
  private testCount: number = 0;

  onBegin(config: FullConfig, suite: Suite) {
    console.log('\n');
    this.testCount = suite.allTests().length;
  }

  onTestBegin(test: TestCase) {
    console.log(`(${this.testId++}/${this.testCount}) ${test.parent.project()!.name} > ${test.title}`)
  }

  async onExit(): Promise<void> {
    console.log('\n');
  }

  onStdOut(chunk: string | Buffer, test: void | TestCase, result: void | TestResult): void {
    console.log(chunk.toString().trim());
  }

  onError(error: TestError): void {
    if (error.message)
      console.log(error.message);
    if (error.cause)
      console.log(error.message);
    if (error.stack)
      console.log(error.stack);
  }
}