import { expect } from "@playwright/test";
import { credentialsUtils } from "../../../utils/index.js";
import loginLocators from "./loginLocators.js";
import BaseSteps from "../../base/baseSteps.js";
import type { AdminPanelSteps } from "../adminPanel/adminPanelSteps.js";

class LoginSteps extends BaseSteps {

    constructor() { super("LoginPage"); }

    verifyLoginIsVisible() {
        this.addStep("verifyLoginIsVisible", async() => {
            console.log(`Verifying "Login" is visible`);
            await expect(loginLocators.loginHeading()).toBeVisible();
        });
        return this;
    }

    populateCredentials(user: string) {
        this.addStep("populateCredentials", async() => {
            console.log("populateCredentials");
            const userCredentials = credentialsUtils.getUserCredentials(user);
            await loginLocators.textbox("Username").fill(userCredentials.username);
            await loginLocators.textbox("Password").fill(userCredentials.password);
        });
        return this;
    }

    clickLogin(adminPanelSteps: AdminPanelSteps) {
        this.addStep("clickLogin", async() => {
            console.log("clickLogin");
            await loginLocators.loginButton().click();
        });
        return adminPanelSteps;
    }
}

export default new LoginSteps();
export type { LoginSteps };