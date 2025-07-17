import test from "@playwright/test";
import config from "../../../playwright.config";

const testFilePath = new RegExp(`${(config.testDir || "").replaceAll(/\./g, "").replaceAll(/\\|\//g, "(\\\\|/)")}(\\\\|/).+.spec.ts:[0-9]+:[0-9]+`);
let stepSequence = Promise.resolve();

/**
 * Searches the callstack for a row pointing to a .spec.ts file.
 * Throws an error if none or multiple rows match. 
 * @param callstack 
 * @returns The row pointing to a .spec.ts file.
 */
function getTestCallRowInStack(callStack: string) {
    const testCallRows = callStack
        .split('\n')
        .filter(row => testFilePath.test(row));
    if (testCallRows.length === 0)
        throw new Error(`Found 0 rows matching ${testFilePath}`);
    else if (testCallRows.length > 1)
        throw new Error(`Found multiple rows matching ${testFilePath}`);
    return testCallRows[0];
}

/**
 * Facilitates the sequential execution of a Test's steps, while writting Tests in a method-chaining manner.
 * When a step fails, the error's callstack is overwritten.
 * The new callstack points to the .spec.ts file's row, that includes the method call, which caused the failure.
 */
const stepSequenceHelper = {

    /**
     * A promise to ensure the sequential execution of the Test's steps.
     */
    get stepSequence() { return stepSequence; },

    /**
     * Adds a step to the stepSequence promise.
     * If a step fails, the error's callstack will be updated to point to the proper row of the .spec.ts file. 
     * @param title 
     * @param callback 
     */
    addStep(title: string, callback: () => void | Promise<void>) {
        const myError = new Error();
        const step = async() => { await test.step(title, callback); }
        stepSequence = stepSequence.then(step).catch((error: unknown) => {
            if (error instanceof Error) {
                if (error.stack && myError.stack)
                    if (error.stack.includes(__filename) && testFilePath.test(myError.stack)) {
                        const stepCallRow = getTestCallRowInStack(myError.stack);
                        const promiseAwaitRow = getTestCallRowInStack(error.stack);
                        error.stack = error.stack
                            .replace(promiseAwaitRow, stepCallRow)
                            .split('\n')
                            .filter(row => !row.includes(__filename))
                            .join('\n');
                    }
                throw error;
            }
        });
    }
}

export default stepSequenceHelper;