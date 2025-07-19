import { test, expect } from "@playwright/test";
import { credentialsUtils } from "../../utils/index.js";
import type { LoginResponse, ValidateResponse, LoginArgs } from "../../types/index.js";
import authRequests from "./authRequests.js";
import { requestHelper, testDataHelper } from "../../helpers/index.js";

const authSteps = {

    async login({ user }: LoginArgs) {
        await test.step("login", async() => {
            console.log("login");
            const userCredentialsObj = credentialsUtils.getUserCredentials(user);
            const response = await authRequests.login(userCredentialsObj);
            expect(response.status()).toEqual(200);
            const token = (await response.json() as LoginResponse).token;
            testDataHelper.pushTestData("token", token);
            requestHelper.putExtraHeader("Cookie", `token=${token}`);
        });
    },

    async validate(tempDataIndex: number) {
        await test.step("validate", async() => {
            console.log("validate");
            const tokenObj = { token: testDataHelper.getTestData("token", tempDataIndex) };
            const response = await authRequests.validate(tokenObj);
            const valid = (await response.json() as ValidateResponse).valid;
            expect(valid).toBeTruthy();
        });
    },

    async logout(token: string) {
        await test.step("logout", async() => {
            console.log("logout");
            const tokenObj = { token: token };
            const response = await authRequests.logout(tokenObj);
            expect(response.status()).toEqual(200);
        });
    }
};

export default authSteps;