import { expect } from "@playwright/test";
import { BrowserHelper } from "../../../helpers/BrowserHelper";
import { StepSequenceHelper } from "../../../helpers/StepSequenceHelper";
import { BasePage } from "../../Base/BasePage";
import { LoginLocators } from "./LoginLocators";
import { DataHelper } from "../../../helpers/DataHelper";

export class LoginPage extends BasePage {
    
    private readonly _loginLocators: LoginLocators;

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, dataHelper: DataHelper) {
        super("Login", browserHelper, stepSequenceHelper, dataHelper);
        this._loginLocators = new LoginLocators(browserHelper);
    }

    verifyLogIntoYourAccountIsVisible() {
        this.addStep("verifyLogIntoYourAccountIsVisible", async() => {
            console.log("Verifying \"Log into your account\" is visible");
            await expect(this._loginLocators.logIntoYourAccountHeading).toBeVisible();
        });
        return this;
    }
}