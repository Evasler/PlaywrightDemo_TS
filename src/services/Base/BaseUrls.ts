export abstract class BaseUrls {

    constructor(private readonly _baseUrl: string, private readonly _serviceBase: string) { }

    get serviceBaseUrl() { return `${this._baseUrl}api/${this._serviceBase}` }
}