import type { APIRequestContext } from "@playwright/test";
import RunsEndpoints from "./RunsEndpoints.js";
import type { ResultDetails, RunDetails } from "../../../types/frameworkTypes.js";

export default class RunsRequests {

    private readonly _runsEndpoints;

    constructor(private readonly _authorizedContext: APIRequestContext, baseUrl: string) { 
        this._runsEndpoints = new RunsEndpoints(baseUrl);
    }

    /**
     * [Creates a Test Run.](https://learn.microsoft.com/en-us/rest/api/azure/devops/test/runs/create)
     * @param payload 
     * @returns 
     */
    postRun(payload: RunDetails) {
        return this._authorizedContext.post(this._runsEndpoints.runs(), { data: payload });
    }

    /**
     * [Updates a Test Run.](https://learn.microsoft.com/en-us/rest/api/azure/devops/test/runs/update)
     * @param runId 
     * @param payload 
     * @returns 
     */
    patchRun(runId: number, payload: RunDetails) {
        return this._authorizedContext.patch(this._runsEndpoints.run(runId), { data: payload });
    }

    /**
     * [Gets Results of a Test Run.](https://learn.microsoft.com/en-us/rest/api/azure/devops/test/results/get)
     * @param runId 
     * @returns 
     */
    getResults(runId: number) {
        return this._authorizedContext.get(this._runsEndpoints.results(runId));
    }

    /**
     * [Updates Results of a Test Run.](https://learn.microsoft.com/en-us/rest/api/azure/devops/test/results/update)
     * @param runId 
     * @param payload 
     * @returns 
     */
    patchResult(runId: number, payload: ResultDetails) {
        return this._authorizedContext.patch(this._runsEndpoints.results(runId), { data: [payload] });
    }
}