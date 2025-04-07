import BaseService from "../services/Base/BaseService";
import RequestHelper from "./RequestHelper";
import ServiceHelper from "./ServiceHelper";

export default class ApiHelper {

    constructor(private readonly _requestHelper: RequestHelper, public readonly serviceHelper: ServiceHelper) { }

    _openNewContext<T extends BaseService>(service: T, authenticatedUser?: string) {
        this._requestHelper.openNewContext(authenticatedUser);
        return service;
    }
}