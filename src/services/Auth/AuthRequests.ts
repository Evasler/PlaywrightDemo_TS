import { BaseRequests } from "../Base/BaseRequests";
import { RequestHelper } from "../../helpers/RequestHelper";
import { AuthUrls } from "./AuthUrls";

export class AuthRequests extends BaseRequests {

    private readonly _authUrls;

    constructor(requestHelper: RequestHelper, baseUrl: string) { 
        super(requestHelper, baseUrl);
        this._authUrls = new AuthUrls(baseUrl);
    }

    login(payload: { username: string; password: string; }) {
        return this.workingRequest.post(this._authUrls.login, { data: payload });
    }

    validate(payload: { token: string })  {
        return this.workingRequest.post(this._authUrls.validate, { data: payload });
    }

    logout(payload: { token: string })  {
        return this.workingRequest.post(this._authUrls.logout, { data: payload });
    }
}