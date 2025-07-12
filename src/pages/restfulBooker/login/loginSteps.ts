import { expect } from "@playwright/test";
import credentialsUtils from "../../../utils/credentialsUtils";
import adminPanelSteps from "../adminPanel/adminPanelSteps";
import stepSequenceHelper from "../../../helpers/chaining/stepSequenceHelper";
import loginLocators from "./loginLocators";

const loginSteps = {

    verifyLoginIsVisible() {
        stepSequenceHelper.addStep("verifyLoginIsVisible", async() => {
            console.log("Verifying \"Login\" is visible");
            await expect(loginLocators.loginHeading()).toBeVisible();
        });
        return this;
    },

    populateCredentials(user: string) {
        stepSequenceHelper.addStep("populateCredentials", async() => {
            console.log("populateCredentials");
            const userCredentials = credentialsUtils.getUserCredentials(user);
            await loginLocators.textbox("Username").fill(userCredentials.username);
            await loginLocators.textbox("Password").fill(userCredentials.password);
        });
        return this;
    },

    clickLogin() {
        stepSequenceHelper.addStep("clickLogin", async() => {
            console.log("clickLogin");
            await loginLocators.loginButton().click();
        });
        return adminPanelSteps;
    }
}

export default loginSteps;