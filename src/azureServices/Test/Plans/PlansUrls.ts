import BaseAzureTestUrls from "../BaseAzureTestUrls"

export default class PlansUrls extends BaseAzureTestUrls {

    constructor(baseUrl: string) { super(baseUrl, "Plans/") }

    private _plan(planId: number) { return `${this.serviceBaseUrl}${planId}` }
    private _suite(planId: number, suiteId: number) { return `${this._plan(planId)}/Suites/${suiteId}` }
    private _pointsFilteredByTestCaseId(planId: number, suiteId: number, testCaseId: number) { return `${this._suite(planId, suiteId)}/points?testCaseId=${testCaseId}` }

    pointsFilteredByTestCaseId(planId: number, suiteId: number, testCaseId: number) { return `${this._pointsFilteredByTestCaseId(planId, suiteId, testCaseId)}&${this.apiSuffix}` }
}