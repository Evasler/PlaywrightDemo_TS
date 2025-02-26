import { expect } from "@playwright/test";
import { getUserCredentials } from "../../helpers/CredentialsHelper";
import { RequestHelper } from "../../helpers/RequestHelper";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { AuthRequests } from "./AuthRequests";
import { BaseService } from "../Base/BaseService";
import { StorageStateHelper } from "../../helpers/StorageStateHelper";

export class AuthService extends BaseService {
    
    private readonly authRequests;

    constructor(requestHelper: RequestHelper, stepSequenceHelper: StepSequenceHelper, storageStateHelper: StorageStateHelper, baseUrl: string) {
        super(requestHelper, stepSequenceHelper, storageStateHelper);
        this.authRequests = new AuthRequests(requestHelper, baseUrl);
    }

    login(user: string) {
        this.addStep("login", async() => {
            console.log("login");
            const userCredentialsObj = getUserCredentials(user);
            const response = await this.authRequests.login(userCredentialsObj);
            expect(response.status()).toEqual(200);
        });
        return this;
    }

    validate(token: string, isValid: boolean) {
        this.addStep("validate", async() => {
            console.log("validate");
            const tokenObj = { token: token };
            const response = await this.authRequests.validate(tokenObj);
            const expectedStatus = isValid ? 200 : 403;
            expect(response.status()).toEqual(expectedStatus);
        });
        return this;
    }

    logout(token: string) {
        this.addStep("logout", async() => {
            console.log("logout");
            const tokenObj = { token: token };
            const response = await this.authRequests.logout(tokenObj);
            expect(response.status()).toEqual(200);
        });
        return this;
    }
}