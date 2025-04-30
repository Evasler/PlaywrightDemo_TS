import test from "@playwright/test";
import config from "../../../playwright.config";

/**
 * Facilitates the sequential execution of a Test's steps, while writting Tests in a method-chaining manner.
 * When a step fails, the error's callstack is overwritten.
 * The new callstack points to the .spec.ts file's row, that includes the method call, which caused the failure.
 */
export default class StepSequenceHelper {
    
    private _testFilePath: RegExp;
    private _testFileStepCall: string | undefined;
    private _stepSequence = Promise.resolve();
    
    constructor() {
        this._testFilePath = new RegExp(`${config.testDir!.replaceAll(/\./g, "").replaceAll(/\\|\//g, "(\\\\|/)")}(\\\\|/).+\.spec\.ts:[0-9]+:[0-9]+$`);
    }

    /**
     * A promise to ensure the sequential execution of the Test's steps.
     */
    get stepSequence() { return this._stepSequence; }

    /**
     * Checks in the callstack for a row pointing to a .spec.ts file.
     * Throws an error if none or multiple rows match. 
     * @param callstack 
     * @returns The row pointing to a .spec.ts file.
     */
    private _getTestFileStepCallOrThrowError(callstack: string) {
        const testErrorRows = callstack!.split('\n').filter(row => this._testFilePath.test(row));
        if (testErrorRows.length === 0)
            throw new Error(`Found 0 rows matching ${this._testFilePath}`);
        else if (testErrorRows.length > 1)
            throw new Error(`Found multiple rows matching ${this._testFilePath}`);
        return testErrorRows[0];
    }

    /**
     * Populates this._testFileStepCall.
     * @param callstack 
     */
    private _populateTestFileStepCall(callstack: string) {
        if (!this._testFileStepCall)
            this._testFileStepCall = this._getTestFileStepCallOrThrowError(callstack);
    }

    /**
     * Overwrites the callstack's row pointing to a .spec.ts file with this._testFileStepCall.
     * @param callstack 
     * @returns The updated callstack.
     */
    private _overwriteTestFileFunctionCall(callstack: string) {
        if (!this._testFileStepCall)
            throw new Error("Test row that caused the Test failure is undefined");
        callstack = callstack.replace(this._getTestFileStepCallOrThrowError(callstack), this._testFileStepCall);
        return callstack;
    }

    /**
     * Adds a step to the stepSequence promise.
     * If a step fails, the error's callstack will be updated to point to the proper row of the .spec.ts file. 
     * @param title 
     * @param callback 
     */
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