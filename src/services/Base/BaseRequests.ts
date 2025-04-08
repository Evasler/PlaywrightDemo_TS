import RequestHelper from "../../helpers/channel/RequestHelper";

export default abstract class BaseRequests {

    constructor(private readonly _requestHelper: RequestHelper) { }

    protected get workingRequest() { return this._requestHelper.workingRequestContext; }
    
    protected get extraHeaders() { return this._requestHelper.getExtraHeaders() }
}