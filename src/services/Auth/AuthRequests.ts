import { BaseRequests } from "../Base/BaseRequests";
import { RequestHelper } from "../../helpers/RequestHelper";

export class AuthRequests extends BaseRequests {

    constructor(requestHelper: RequestHelper, baseUrl: string) { super(requestHelper, baseUrl) }

    private readonly _authBase = "auth/";
    private readonly _login = "login";
    private readonly _validate = "validate";
    private readonly _logout = "logout";

    private get _loginBaseUrl() { return `${this.baseUrl}${this._authBase}` }
    private get _loginUrl() { return `${this._loginBaseUrl}${this._login}`}
    private get _validateUrl() { return `${this._loginBaseUrl}${this._validate}`}
    private get _logoutUrl() { return `${this._loginBaseUrl}${this._logout}`}

    async login(payload: { username: string; password: string; }) {
        return this.workingRequest.post(this._loginUrl, { data: payload });
    }

    async validate(payload: { token: string })  {
        return this.workingRequest.post(this._validateUrl, { data: payload });
    }

    async logout(payload: { token: string })  {
        return this.workingRequest.post(this._logoutUrl, { data: payload });
    }
}