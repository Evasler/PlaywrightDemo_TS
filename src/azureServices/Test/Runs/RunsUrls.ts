import { BaseAzureTestUrls } from "../BaseAzureTestUrls";

export class RunsUrls extends BaseAzureTestUrls {

    constructor(baseUrl: string) { super(baseUrl, "Runs/") }

    private _results(runId: number) { return `${this.serviceBaseUrl}${runId}/results` }

    runs() { return `${this.serviceBaseUrl}?${this.apiSuffix}` }
    run(runId: number) { return `${this.serviceBaseUrl}${runId}?${this.apiSuffix}` }
    results(runId: number) { return `${this._results(runId)}?${this.apiSuffix}` }
    result(runId: number, resultId: number) { return `${this._results(runId)}/${resultId}?${this.apiSuffix}` }
}