import { TestDataKeys } from "../../customTypes/frameworkTypes";

const testData = new Map<TestDataKeys,Array<string>>();

/**
 * Facilitates data-sharing between methods, while writting Tests in a method-chaining manner. 
 */
const testDataHelper = {

    /**
     * Stores the value in the Array of values of the specified key.
     * @param key 
     * @param value
     */
    pushTestData(key: TestDataKeys, value: string) {
        let values = testData.get(key);
        if (!values) {
            values = [];
            testData.set(key, values);
        }
        values.push(value);
    },

    /**
     * @param key 
     * @param index 
     * @returns The value at index location of the Array of specified key.
     */
    getTestData(key: TestDataKeys, index: number) {
        const values = testData.get(key);
        if (!values || index < 0 || index >= values.length)
            throw new Error(`No test data found for "${key}" at "${index}"`);
        return values[index];
    },

    /**
     * Resets the test data by clearing the Map.
     */
    resetTestData() {
        testData.clear();
    }
}

export default testDataHelper;