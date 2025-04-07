import { expect } from "@playwright/test";
import BrowserHelper from "../../../helpers/BrowserHelper";
import StepSequenceHelper from "../../../helpers/StepSequenceHelper";
import BasePage from "../../Base/BasePage";
import LoginLocators from "./LoginLocators";
import TempDataHelper from "../../../helpers/TempDataHelper";
import CredentialsUtils from "../../../utils/CredentialsUtils";
import AdminPanelPage from "../AdminPanel/AdminPanelPage";

export default class LoginPage extends BasePage {
    
    private readonly _loginLocators: LoginLocators;

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, tempDataHelper: TempDataHelper) {
        super("Login", browserHelper, stepSequenceHelper, tempDataHelper);
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

    clickLogin(adminPanelPage: AdminPanelPage) {
        this.addStep("clickLogin", async() => {
            console.log("clickLogin");
            await this._loginLocators.loginButton.click();
        });
        return adminPanelPage;
    }
}