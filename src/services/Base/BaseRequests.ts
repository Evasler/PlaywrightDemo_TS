import RequestHelper from "../../helpers/channel/RequestHelper";

/**
 * Provides basic functionality shared across all Requests classes.
 */
export default abstract class BaseRequests {

    constructor(private readonly _requestHelper: RequestHelper) { }

    /**
     * The focused Request Context.
     */
    protected get workingRequest() { return this._requestHelper.workingRequestContext; }
    
    /**
     * The extra headers for the focused Request Context.
     */
    protected get extraHeaders() { return this._requestHelper.getExtraHeaders() }
}