import test from "@playwright/test";
import config from "../../playwright.config";

export default class StepSequenceHelper {
    
    private _testFilePath: RegExp;
    private _testFileStepCall: string | undefined;
    private _stepSequence = Promise.resolve();
    
    constructor() {
        this._testFilePath = new RegExp(`${config.testDir!.replaceAll(/\./g, "").replaceAll(/\\|\//g, "(\\\\|/)")}(\\\\|/).+\.spec\.ts:[0-9]+:[0-9]+$`);
    }

    get stepSequence() { return this._stepSequence; }

    private _getTestFileStepCallOrThrowError(callstack: string) {
        const testErrorRows = callstack!.split('\n').filter(row => this._testFilePath.test(row));
        if (testErrorRows.length === 0)
            throw new Error(`Found 0 rows matching ${this._testFilePath}`);
        else if (testErrorRows.length > 1)
            throw new Error(`Found multiple rows matching ${this._testFilePath}`);
        return testErrorRows[0];
    }

    private _populateTestFileStepCall(callstack: string) {
        if (!this._testFileStepCall)
            this._testFileStepCall = this._getTestFileStepCallOrThrowError(callstack);
    }

    private _overwriteTestFileFunctionCall(callstack: string) {
        if (!this._testFileStepCall)
            throw new Error("Test row that caused the Test failure is unknown");
        callstack = callstack.replace(this._getTestFileStepCallOrThrowError(callstack), this._testFileStepCall);
        return callstack;
    }

    addStep(title: string, callback: () => Promise<void>) {
        const myError = new Error();
        const step = async() => { await test.step(title, callback); }
        this._stepSequence = this._stepSequence.then(step).catch(error => {
            this._populateTestFileStepCall(myError.stack!);
            error.stack = this._overwriteTestFileFunctionCall(error.stack!);
            throw error;
        });
    }
}