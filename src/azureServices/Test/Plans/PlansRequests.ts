import type { APIRequestContext } from "@playwright/test";
import PlansEndpoints from "./PlansEndpoints.js";

export default class PlansRequests {

    private readonly _plansEndpoints;

    constructor(private readonly _authorizedContext: APIRequestContext, baseUrl: string) { 
        this._plansEndpoints = new PlansEndpoints(baseUrl);
    }

    /**
     * [Gets Test Points by Test Case ID.](https://learn.microsoft.com/en-us/rest/api/azure/devops/testplan/test-point/get-points)
     * @param planId 
     * @param suiteId 
     * @param testCaseId 
     */
    getPointsFilteredByTestCaseId(planId: number, suiteId: number, testCaseId: number) {
        return this._authorizedContext.get(this._plansEndpoints.pointsFilteredByTestCaseId(planId, suiteId, testCaseId));
    }
}