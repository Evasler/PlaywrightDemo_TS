import { expect } from "@playwright/test";
import credentialsUtils from "../../utils/CredentialsUtils";
import { LoginResponse, ValidateResponse } from "../../customTypes/ApiResponseTypes";
import { LoginArgs } from "../../customTypes/StepArgsTypes";
import authRequests from "./AuthRequests";
import stepSequenceHelper from "../../helpers/chaining/StepSequenceHelper";
import requestHelper from "../../helpers/channel/RequestHelper";
import testDataHelper from "../../helpers/data/TestDataHelper";

const authSteps = {

    login({ user }: LoginArgs) {
        stepSequenceHelper.addStep("login", async() => {
            console.log("login");
            const userCredentialsObj = credentialsUtils.getUserCredentials(user);
            const response = await authRequests.login(userCredentialsObj);
            expect(response.status()).toEqual(200);
            const token = (await response.json() as LoginResponse).token;
            testDataHelper.pushTestData("token", token);
            requestHelper.putExtraHeader("Cookie", `token=${token}`);
        });
        return this;
    },

    validate(tempDataIndex: number) {
        stepSequenceHelper.addStep("validate", async() => {
            console.log("validate");
            const tokenObj = { token: testDataHelper.getTestData("token", tempDataIndex) };
            const response = await authRequests.validate(tokenObj);
            const valid = (await response.json() as ValidateResponse).valid;
            expect(valid).toBeTruthy();
        });
        return this;
    },

    logout(token: string) {
        stepSequenceHelper.addStep("logout", async() => {
            console.log("logout");
            const tokenObj = { token: token };
            const response = await authRequests.logout(tokenObj);
            expect(response.status()).toEqual(200);
        });
        return this;
    }
};

export default authSteps;