import { APIRequestContext } from "@playwright/test";
import PlansRequests from "./PlansRequests";

export default class PlansSteps {
    
    private readonly _plansRequests;

    constructor(authorizedContext: APIRequestContext, baseUrl: string) {
        this._plansRequests = new PlansRequests(authorizedContext, baseUrl);
    }

    /**
     * Gets a Test Point by Test Case ID.
     * @param planId 
     * @param suiteId 
     * @param testCaseId 
     * @returns The appropriate error message, if there was a failure. Otherwise, undefined.
     */
    async getRequestError(planId: number, suiteId: number, testCaseId: number) {
        try {
            const response = await this._plansRequests.getPointsFilteredByTestCaseId(planId, suiteId, testCaseId);
            if (response.status() === 203 || response.status() === 401)
                return "User is Unauthorized";
            else if (response.status() === 403)
                return "Searching Test Points is Forbidden for this user";
            else if (response.status() === 404) {
                try {
                    const responseJson: { message: string } = await response.json();
                    return responseJson.message;
                } catch(error) {
                    return await response.text();
                }
            }
        } catch(error) {
            return "Property \"azureBaseUrl\" in playwright.config is invalid";
        }
        return undefined;
    }

    /**
     * Gets a Test Point.
     * @param planId 
     * @param suiteId 
     * @param testCaseId 
     * @param configurationName 
     * @returns The Test Point's ID, if a single Test Point is retrieved. Otherwise, undefined.
     */
    async getTestPointId(planId: number, suiteId: number, testCaseId: number, configurationName: string) {
        try {
            const response = await this._plansRequests.getPointsFilteredByTestCaseId(planId, suiteId, testCaseId);
            const responseJson: { value: { id: number; configuration: { id: string; name: string; }}[]} = await response.json();
            const testPoint = responseJson.value.filter( testPoint => testPoint.configuration.name === configurationName);
            if (testPoint.length === 1)
                return testPoint[0].id;
            return undefined;
        } catch(error) {
            return undefined;
        }
    }
}