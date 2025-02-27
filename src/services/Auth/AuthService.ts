import { expect } from "@playwright/test";
import { getUserCredentials } from "../../helpers/CredentialsHelper";
import { RequestHelper } from "../../helpers/RequestHelper";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { AuthRequests } from "./AuthRequests";
import { BaseService } from "../Base/BaseService";

export class AuthService extends BaseService {
    
    private readonly _authRequests;

    constructor(requestHelper: RequestHelper, stepSequenceHelper: StepSequenceHelper, baseUrl: string) {
        super(requestHelper, stepSequenceHelper);
        this._authRequests = new AuthRequests(requestHelper, baseUrl);
    }

    login(user: string) {
        this.addStep("login", async() => {
            console.log("login");
            const userCredentialsObj = getUserCredentials(user);
            const response = await this._authRequests.login(userCredentialsObj);
            expect(response.status()).toEqual(200);
        });
        return this;
    }

    validate(token: string, isValid: boolean) {
        this.addStep("validate", async() => {
            console.log("validate");
            const tokenObj = { token: token };
            const response = await this._authRequests.validate(tokenObj);
            const expectedStatus = isValid ? 200 : 403;
            expect(response.status()).toEqual(expectedStatus);
        });
        return this;
    }

    logout(token: string) {
        this.addStep("logout", async() => {
            console.log("logout");
            const tokenObj = { token: token };
            const response = await this._authRequests.logout(tokenObj);
            expect(response.status()).toEqual(200);
        });
        return this;
    }
}