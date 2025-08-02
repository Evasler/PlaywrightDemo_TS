import { test, expect } from "@playwright/test";
import { credentialsUtils } from "../../utils/index.js";
import type { LoginResponse, ValidateResponse, LoginArgs } from "../../types/index.js";
import authRequests from "./authRequests.js";
import testDataHelper from "../../helpers/data/testDataHelper.js";
import requestHelper from "../../helpers/channel/requestHelper.js";

const authSteps = {

    login({ user }: LoginArgs) {
        return test.step(`Logging in as user "${user}"`, async() => {
            console.log(`Logging in as user "${user}"`);
            const userCredentialsObj = credentialsUtils.getUserCredentials(user);
            const response = await authRequests.login(userCredentialsObj);
            expect(response.status()).toEqual(200);
            const token = (await response.json() as LoginResponse).token;
            testDataHelper.pushTestData("token", token);
            requestHelper.putExtraHeader("Cookie", `token=${token}`);
        });
    },

    validate(tempDataIndex: number) {
        return test.step("Validating session token", async() => {
            const token = testDataHelper.getTestData("token", tempDataIndex);
            console.log(`Validating session token "${token}"`);
            const tokenObj = { token: token };
            const response = await authRequests.validate(tokenObj);
            const valid = (await response.json() as ValidateResponse).valid;
            expect(valid).toBeTruthy();
        });
    },

    logout(token: string) {
        return test.step(`Logging out token "${token}"`, async() => {
            console.log(`Logging out token "${token}"`);
            const tokenObj = { token: token };
            const response = await authRequests.logout(tokenObj);
            expect(response.status()).toEqual(200);
        });
    }
};

export default authSteps;