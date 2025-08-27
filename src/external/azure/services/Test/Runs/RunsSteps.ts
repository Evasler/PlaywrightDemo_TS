import type { APIRequestContext } from "@playwright/test";
import RunsRequests from "./RunsRequests.js";
import type { ResultDetails, RunDetails } from "../../../types.js";

export default class RunsSteps {
  private readonly _runsRequests;

  constructor(authorizedContext: APIRequestContext, baseUrl: string) {
    this._runsRequests = new RunsRequests(authorizedContext, baseUrl);
  }

  /**
   * Creates a Test Run.
   * @param payload
   * @returns The Test Run's ID, if it was created. Otherwise, the appropriate error message.
   */
  async createRunAndCatchUserError(
    payload: RunDetails,
  ): Promise<number | string> {
    try {
      const response = await this._runsRequests.postRun(payload);
      if (response.status() === 401) return "User is Unauthorized";
      else if (response.status() === 403)
        return "Creating a Run is Forbidden for this user";
      const responseJson = (await response.json()) as { id: number };
      return responseJson.id;
    } catch {
      return "Error occured during the Run creation";
    }
  }

  /**
   * Updates a Test Run.
   * @param runId
   * @param payload
   */
  async updateRun(runId: number, payload: RunDetails) {
    await this._runsRequests.patchRun(runId, payload);
  }

  /**
   * Updates the Results of a Test Run.
   * @param runId
   * @param payload
   */
  async updateResult(runId: number, payload: ResultDetails) {
    await this._runsRequests.patchResult(runId, payload);
  }

  /**
   * @param runId
   * @param pointId
   * @returns The Test Result ID, if it exists. Otherwise, undefined.
   */
  async getResultId(runId: number, pointId: string) {
    try {
      const results = await this._runsRequests.getResults(runId);
      const resultsJson = (await results.json()) as {
        value: { id: number; testPoint: { id: string } }[];
      };
      const result = resultsJson.value.filter(
        (result) => result.testPoint.id === pointId,
      );
      return result[0].id;
    } catch {
      return undefined;
    }
  }
}
