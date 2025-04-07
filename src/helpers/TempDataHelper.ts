export default class TempDataHelper {
    
    private tempStringData = new Map<string,string>();
    private tempNumberData = new Map<string,number>();
    private tempBooleanData = new Map<string,boolean>();

    setTempData<T extends string | number | boolean>(key: string, value: T) {
        if (typeof value === "string")
            this.tempStringData.set(key, value);
        else if (typeof value === "number")
            this.tempNumberData.set(key, value);
        else if (typeof value === "boolean")
            this.tempBooleanData.set(key, value);
    }

    getTempStringData(key: string) {
        if (!this.tempStringData.has(key))
            throw new Error(`${key} not found in tempStringData`);
        const tempData = this.tempStringData.get(key)!;
        this.tempStringData.delete(key);
        return tempData;
    }

    getTempNumberData(key: string) {
        if (!this.tempNumberData.has(key))
            throw new Error(`${key} not found in tempNumberData`);
        const tempData = this.tempNumberData.get(key)!;
        this.tempNumberData.delete(key);
        return tempData;
    }

    getTempBooleanData(key: string) {
        if (!this.tempBooleanData.has(key))
            throw new Error(`${key} not found in tempBooleanData`);
        const tempData = this.tempBooleanData.get(key)!;
        this.tempBooleanData.delete(key);
        return tempData;
    }
}