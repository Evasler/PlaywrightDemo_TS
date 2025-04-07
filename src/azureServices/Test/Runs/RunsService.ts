import { APIRequestContext } from "@playwright/test";
import RunsRequests from "./RunsRequests";
import { ResultDetails, RunDetails } from "../../../customTypes/FrameworkTypes";

export default class RunsService {
    
    private readonly _runsRequests;

    constructor(authorizedContext: APIRequestContext, baseUrl: string) {
        this._runsRequests = new RunsRequests(authorizedContext, baseUrl);
    }

    async createRunAndCatchUserError(payload: RunDetails): Promise<{ runId: number | undefined; userError: string | undefined }> {
        const response = await this._runsRequests.postRun(payload);
        let userError = undefined;
        if (response.status() === 401)
            userError = "User is Unauthorized";
        else if (response.status() === 403)
            userError = "Creating a Run is Forbidden for this user";
        try {
            const responseJson: { id: number } = await response.json();
            return { runId: responseJson.id, userError: userError };
        } catch(error) {
            return { runId: undefined, userError: userError };
        }
    }

    async updateRun(runId: number, payload: RunDetails) {
        await this._runsRequests.patchRun(runId, payload);
    }

    async updateResult(runId: number, payload: ResultDetails) {
        await this._runsRequests.patchResult(runId, payload);
    }

    async getResultId(runId: number, pointId: string) {
        try {
            const results = await this._runsRequests.getResults(runId);
            const resultsJson: { value: { id: number; testPoint: { id: string } }[] } = await results.json();
            const result = resultsJson.value.filter(result => result.testPoint.id === pointId);
            return result[0].id;
        } catch(error) {
            return undefined;
        }
    }
}