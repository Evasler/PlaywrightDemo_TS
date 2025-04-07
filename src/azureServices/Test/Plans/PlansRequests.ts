import { APIRequestContext } from "@playwright/test";
import PlansUrls from "./PlansUrls";

export default class PlansRequests {

    private readonly _plansUrls;

    constructor(private readonly _authorizedContext: APIRequestContext, baseUrl: string) { 
        this._plansUrls = new PlansUrls(baseUrl);
    }

    getPointsFilteredByTestCaseId(planId: number, suiteId: number, testCaseId: number) {
        return this._authorizedContext.get(this._plansUrls.pointsFilteredByTestCaseId(planId, suiteId, testCaseId));
    }
}