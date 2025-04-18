export default class TempDataHelper {
    
    private _tempStringData = new Map<string,string>();
    private _tempNumberData = new Map<string,number>();
    private _tempBooleanData = new Map<string,boolean>();

    setTempData<T extends string | number | boolean>(key: string, value: T) {
        if (typeof value === "string")
            this._tempStringData.set(key, value);
        else if (typeof value === "number")
            this._tempNumberData.set(key, value);
        else if (typeof value === "boolean")
            this._tempBooleanData.set(key, value);
    }

    getTempStringData(key: string) {
        if (!this._tempStringData.has(key))
            throw new Error(`${key} not found in tempStringData`);
        const tempData = this._tempStringData.get(key)!;
        this._tempStringData.delete(key);
        return tempData;
    }

    getTempNumberData(key: string) {
        if (!this._tempNumberData.has(key))
            throw new Error(`${key} not found in tempNumberData`);
        const tempData = this._tempNumberData.get(key)!;
        this._tempNumberData.delete(key);
        return tempData;
    }

    getTempBooleanData(key: string) {
        if (!this._tempBooleanData.has(key))
            throw new Error(`${key} not found in tempBooleanData`);
        const tempData = this._tempBooleanData.get(key)!;
        this._tempBooleanData.delete(key);
        return tempData;
    }
}