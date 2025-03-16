import { BaseService } from "../services/Base/BaseService";
import { RequestHelper } from "./RequestHelper";
import { ServiceHelper } from "./ServiceHelper";

export class ApiHelper {

    constructor(private readonly _requestHelper: RequestHelper, public readonly serviceHelper: ServiceHelper) { }

    openNewContext<T extends BaseService>(service: T, authenticatedUser?: string) {
        this._requestHelper.openNewContext(authenticatedUser);
        return service;
    }
}