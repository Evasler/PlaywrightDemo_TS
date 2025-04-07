import BaseRequests from "../Base/BaseRequests";
import RequestHelper from "../../helpers/RequestHelper";
import AuthUrls from "./AuthUrls";

export default class AuthRequests extends BaseRequests {

    private readonly _authUrls;

    constructor(requestHelper: RequestHelper, baseUrl: string) { 
        super(requestHelper);
        this._authUrls = new AuthUrls(baseUrl);
    }

    login(payload: { username: string; password: string; }) {
        return this.workingRequest.post(this._authUrls.login, { data: payload, headers: this.extraHeaders });
    }

    validate(payload: { token: string })  {
        return this.workingRequest.post(this._authUrls.validate, { data: payload, headers: this.extraHeaders });
    }

    logout(payload: { token: string })  {
        return this.workingRequest.post(this._authUrls.logout, { data: payload, headers: this.extraHeaders });
    }
}