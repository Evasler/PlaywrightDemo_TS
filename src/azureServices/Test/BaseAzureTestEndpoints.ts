export default abstract class BaseAzureTestEndpoints {
  protected readonly apiSuffix = "api-version=7.1";

  constructor(
    private readonly _baseUrl: string,
    private readonly _serviceBase: string,
  ) {}

  protected get serviceBaseEndpoint() {
    return `${this._baseUrl}_apis/test/${this._serviceBase}`;
  }
}
