import { TempDataKeys } from "../../customTypes/FrameworkTypes";

/**
 * Facilitates data-sharing between methods, while writting Tests in a method-chaining manner. 
 */
export default class TempDataHelper {

    private tempData = new Map<TempDataKeys,Array<string>>();

    /**
     * Stores the value in the Array of values of the specified key.
     * @param key 
     * @param value
     */
    pushTempData(key: TempDataKeys, value: string) {
        if (!this.tempData.get(key))
            this.tempData.set(key, []);
        this.tempData.get(key)!.push(value);
    }

    /**
     * @param key 
     * @param index 
     * @returns The value at index location of the Array of specified key.
     */
    getTempData(key: TempDataKeys, index: number) {
        return this.tempData.get(key)![index];
    }
}