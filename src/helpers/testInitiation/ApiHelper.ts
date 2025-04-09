import BaseServiceSteps from "../../services/Base/BaseServiceSteps";
import RequestHelper from "../channel/RequestHelper";
import ServiceStepsHelper from "../objectInstantiation/ServiceStepsHelper";

export default class ApiHelper {

    constructor(private readonly _requestHelper: RequestHelper, public readonly serviceStepsHelper: ServiceStepsHelper) { }

    _openNewContext<T extends BaseServiceSteps>(serviceSteps: T, authenticatedUser?: string) {
        this._requestHelper.openNewContext(authenticatedUser);
        return serviceSteps;
    }
}