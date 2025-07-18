import { expect } from "@playwright/test";
import credentialsUtils from "../../../utils/credentialsUtils.js";
import loginLocators from "./loginLocators.js";
import BaseSteps from "../../base/baseSteps.js";
import adminPanelSteps from "../adminPanel/adminPanelSteps.js";

class LoginSteps extends BaseSteps {

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

    clickLogin() {
        this.addStep("clickLogin", async() => {
            console.log("clickLogin");
            await loginLocators.loginButton().click();
        });
        return adminPanelSteps;
    }
}

export default new LoginSteps("LoginPage");