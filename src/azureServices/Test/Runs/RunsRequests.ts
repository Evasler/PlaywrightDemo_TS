import { APIRequestContext } from "@playwright/test";
import RunsUrls from "./RunsUrls";
import { ResultDetails, RunDetails } from "../../../customTypes/FrameworkTypes";

export default class RunsRequests {

    private readonly _runsUrls;

    constructor(private readonly _authorizedContext: APIRequestContext, baseUrl: string) { 
        this._runsUrls = new RunsUrls(baseUrl);
    }

    postRun(payload: RunDetails) {
        return this._authorizedContext.post(this._runsUrls.runs(), { data: payload });
    }

    patchRun(runId: number, payload: RunDetails) {
        return this._authorizedContext.patch(this._runsUrls.run(runId), { data: payload });
    }

    getResults(runId: number) {
        return this._authorizedContext.get(this._runsUrls.results(runId));
    }

    patchResult(runId: number, payload: ResultDetails) {
        return this._authorizedContext.patch(this._runsUrls.results(runId), { data: [payload] });
    }
}