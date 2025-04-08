import { expect } from "@playwright/test";
import BrowserHelper from "../../../helpers/channel/BrowserHelper";
import StepSequenceHelper from "../../../helpers/chaining/StepSequenceHelper";
import BasePageSteps from "../../Base/BasePageSteps";
import LoginLocators from "./LoginLocators";
import TempDataHelper from "../../../helpers/chaining/TempDataHelper";
import CredentialsUtils from "../../../utils/CredentialsUtils";
import AdminPanelSteps from "../AdminPanel/AdminPanelSteps";

export default class LoginSteps extends BasePageSteps {
    
    private readonly _loginLocators: LoginLocators;

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, tempDataHelper: TempDataHelper) {
        super("LoginPage", browserHelper, stepSequenceHelper, tempDataHelper);
        this._loginLocators = new LoginLocators(browserHelper);
    }

    verifyLoginIsVisible() {
        this.addStep("verifyLoginIsVisible", async() => {
            console.log("Verifying \"Login\" is visible");
            await expect(this._loginLocators.loginHeading).toBeVisible();
        });
        return this;
    }

    populateCredentials(user: string) {
        this.addStep("populateCredentials", async() => {
            console.log("populateCredentials");
            const userCredentials = CredentialsUtils.getUserCredentials(user);
            await this._loginLocators.textbox("Username").fill(userCredentials.username);
            await this._loginLocators.textbox("Password").fill(userCredentials.password);
        });
        return this;
    }

    clickLogin(adminPanelPage: AdminPanelSteps) {
        this.addStep("clickLogin", async() => {
            console.log("clickLogin");
            await this._loginLocators.loginButton.click();
        });
        return adminPanelPage;
    }
}