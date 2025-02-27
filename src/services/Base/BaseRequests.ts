import { RequestHelper } from "../../helpers/RequestHelper";

export class BaseRequests {

    constructor(private readonly _requestHelper: RequestHelper) { }

    protected get workingRequest() { return this._requestHelper.workingRequestContext; }
}