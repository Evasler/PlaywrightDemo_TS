import { TestDataKeys } from "../../customTypes/FrameworkTypes";

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
        if (!testData.get(key))
            testData.set(key, []);
        testData.get(key)!.push(value);
    },

    /**
     * @param key 
     * @param index 
     * @returns The value at index location of the Array of specified key.
     */
    getTestData(key: TestDataKeys, index: number) {
        return testData.get(key)![index];
    },

    /**
     * Resets the test data by clearing the Map.
     */
    resetTestData() {
        testData.clear();
    }
}

export default testDataHelper;