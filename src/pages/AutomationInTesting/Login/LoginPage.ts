import { expect } from "@playwright/test";
import { BrowserHelper } from "../../../helpers/BrowserHelper";
import { StepSequenceHelper } from "../../../helpers/StepSequenceHelper";
import { BasePage } from "../../Base/BasePage";
import { LoginLocators } from "./LoginLocators";

export class LoginPage extends BasePage {
    
    private readonly loginLocators: LoginLocators;

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper) {
        super("Login", browserHelper, stepSequenceHelper);
        this.loginLocators = new LoginLocators(browserHelper);
    }

    verifyLogIntoYourAccountIsVisible() {
        this.addStep("verifyLogIntoYourAccountIsVisible", async() => {
            console.log("Verifying \"Log into your account\" is visible");
            await expect(this.loginLocators.logIntoYourAccountHeading).toBeVisible();
        });
        return this;
    }
}