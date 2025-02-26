import { expect } from "@playwright/test";
import { getUserCredentials } from "../../helpers/CredentialsHelper";
import { RequestHelper } from "../../helpers/RequestHelper";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { AuthRequests } from "./AuthRequests";
import { BaseService } from "../Base/BaseService";

export class AuthService extends BaseService {
    
    private readonly authRequests;

    constructor(requestHelper: RequestHelper, stepSequenceHelper: StepSequenceHelper, baseUrl: string) {
        super(requestHelper, stepSequenceHelper);
        this.authRequests = new AuthRequests(requestHelper, baseUrl);
    }

    login(user: string) {
        this.addStep("login", async() => {
            const userCredentialsObj = getUserCredentials(user);
            const response = await this.authRequests.login(userCredentialsObj);
            expect(response.status()).toEqual(200);
        });
        return this;
    }

    validate(token: string, isValid: boolean) {
        this.addStep("validate", async() => {
            const tokenObj = { token: token };
            const response = await this.authRequests.validate(tokenObj);
            const expectedStatus = isValid ? 200 : 403;
            expect(response.status()).toEqual(expectedStatus);
        });
        return this;
    }

    logout(token: string) {
        this.addStep("logout", async() => {
            const tokenObj = { token: token };
            const response = await this.authRequests.logout(tokenObj);
            expect(response.status()).toEqual(200);
        });
        return this;
    }
}