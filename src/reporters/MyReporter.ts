import type { Reporter, FullConfig, Suite, TestCase, TestError } from '@playwright/test/reporter';

export default class MyReporter implements Reporter {

  private _testId = 1;
  private _testCount: number = 0;

  onBegin(config: FullConfig, suite: Suite) {
    console.log('\n');
    this._testCount = suite.allTests().length;
  }

  onTestBegin(test: TestCase) {
    const project = test.parent.project();
    console.log(`(${this._testId++}/${this._testCount}) ${project ? project.name : "projectlessSuite"} > ${test.title}`)
  }

  async onExit(): Promise<void> { // eslint-disable-line @typescript-eslint/require-await
    console.log('\n');
  }

  onStdOut(chunk: string | Buffer): void {
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