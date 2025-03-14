import { expect } from "@playwright/test";
import { getUserCredentials } from "../../helpers/CredentialsHelper";
import { RequestHelper } from "../../helpers/RequestHelper";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { AuthRequests } from "./AuthRequests";
import { BaseService } from "../Base/BaseService";
import { TempDataHelper } from "../../helpers/TempDataHelper";
import { LoginResponse, ValidateResponse } from "../../customTypes/ApiResponseTypes";

export class AuthService extends BaseService {
    
    private readonly _authRequests;

    constructor(requestHelper: RequestHelper, stepSequenceHelper: StepSequenceHelper, tempDataHelper: TempDataHelper, baseUrl: string) {
        super(requestHelper, stepSequenceHelper, tempDataHelper);
        this._authRequests = new AuthRequests(requestHelper, baseUrl);
    }

    login(user: string) {
        this.addStep("login", async() => {
            console.log("login");
            const userCredentialsObj = getUserCredentials(user);
            const response = await this._authRequests.login(userCredentialsObj);
            expect(response.status()).toEqual(200);
            const token = (await response.json() as LoginResponse).token;
            this.setTempData("token", token)
            this.putExtraHeader("Cookie", `token=${token}`);
        });
        return this;
    }

    validate() {
        this.addStep("validate", async() => {
            console.log("validate");
            const tokenObj = { token: this.getTempStringData("token") };
            const response = await this._authRequests.validate(tokenObj);
            const valid = (await response.json() as ValidateResponse).valid;
            expect(valid).toBeTruthy();
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