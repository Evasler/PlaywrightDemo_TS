import { APIRequestContext } from "@playwright/test";
import RunsUrls from "./RunsUrls";
import { ResultDetails, RunDetails } from "../../../customTypes/frameworkTypes";

export default class RunsRequests {

    private readonly _runsUrls;

    constructor(private readonly _authorizedContext: APIRequestContext, baseUrl: string) { 
        this._runsUrls = new RunsUrls(baseUrl);
    }

    /**
     * [Creates a Test Run.](https://learn.microsoft.com/en-us/rest/api/azure/devops/test/runs/create)
     * @param payload 
     * @returns 
     */
    postRun(payload: RunDetails) {
        return this._authorizedContext.post(this._runsUrls.runs(), { data: payload });
    }

    /**
     * [Updates a Test Run.](https://learn.microsoft.com/en-us/rest/api/azure/devops/test/runs/update)
     * @param runId 
     * @param payload 
     * @returns 
     */
    patchRun(runId: number, payload: RunDetails) {
        return this._authorizedContext.patch(this._runsUrls.run(runId), { data: payload });
    }

    /**
     * [Gets Results of a Test Run.](https://learn.microsoft.com/en-us/rest/api/azure/devops/test/results/get)
     * @param runId 
     * @returns 
     */
    getResults(runId: number) {
        return this._authorizedContext.get(this._runsUrls.results(runId));
    }

    /**
     * [Updates Results of a Test Run.](https://learn.microsoft.com/en-us/rest/api/azure/devops/test/results/update)
     * @param runId 
     * @param payload 
     * @returns 
     */
    patchResult(runId: number, payload: ResultDetails) {
        return this._authorizedContext.patch(this._runsUrls.results(runId), { data: [payload] });
    }
}