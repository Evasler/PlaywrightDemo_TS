import BaseServiceSteps from "../../services/Base/BaseServiceSteps";
import RequestHelper from "../channel/RequestHelper";
import ServiceStepsHelper from "../objectInstantiation/ServiceStepsHelper";

/**
 * Facilitates writting API Tests in a method-chaining manner.
 * Serves as a starting point for the API tests.
 * Provides the necessary ServiceStepsHelper, as well as, a way to open the initial tab.
 */
export default class ApiHelper {

    constructor(private readonly _requestHelper: RequestHelper, public readonly serviceStepsHelper: ServiceStepsHelper) { }

    /**
     * Opens the initial request context.
     * @param serviceSteps 
     * @param authenticatedUser The user whose storageState file should be loaded in the request context.
     * @returns The serviceSteps object, which should be used after this method.
     */
    _openNewContext<T extends BaseServiceSteps>(serviceSteps: T, authenticatedUser?: string) {
        this._requestHelper.openNewContext(authenticatedUser);
        return serviceSteps;
    }
}