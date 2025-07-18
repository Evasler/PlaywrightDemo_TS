import BaseAzureTestEndpoints from "../BaseAzureTestEndpoints.js";

export default class RunsEndpoints extends BaseAzureTestEndpoints {

    constructor(baseUrl: string) { super(baseUrl, "Runs/") }

    private _results(runId: number) { return `${this.serviceBaseEndpoint}${runId}/results` }

    runs() { return `${this.serviceBaseEndpoint}?${this.apiSuffix}` }
    run(runId: number) { return `${this.serviceBaseEndpoint}${runId}?${this.apiSuffix}` }
    results(runId: number) { return `${this._results(runId)}?${this.apiSuffix}` }
    result(runId: number, resultId: number) { return `${this._results(runId)}/${resultId}?${this.apiSuffix}` }
}