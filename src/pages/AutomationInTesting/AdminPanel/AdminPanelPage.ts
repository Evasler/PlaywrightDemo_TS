import { expect } from "@playwright/test";
import { BrowserHelper } from "../../../helpers/BrowserHelper";
import { StepSequenceHelper } from "../../../helpers/StepSequenceHelper";
import { BasePage } from "../../Base/BasePage";
import { AdminPanelLocators } from "./AdminPanelLocators";

export class AdminPanelPage extends BasePage {

    private readonly adminPanelLocators: AdminPanelLocators;

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper) {
        super("AdminPanel", browserHelper, stepSequenceHelper);
        this.adminPanelLocators = new AdminPanelLocators(browserHelper);
    }
    
    verifyLogoutIsVisible() {
        this.addStep("verifyLogIntoYourAccountIsVisible", async() => {
            console.log("Verifying \"Logout\" is visible");
            await expect(this.adminPanelLocators.logoutLink).toBeVisible();
        });
        return this;
    }
}