import { RequestHelper } from "../../helpers/RequestHelper";

export class BaseRequests {

    constructor(private readonly _requestHelper: RequestHelper, protected readonly baseUrl: string) { }

    protected get workingRequest() { return this._requestHelper.workingRequestContext; }
}