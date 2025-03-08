import { expect } from "@playwright/test";
import { BrowserHelper } from "../../../helpers/BrowserHelper";
import { StepSequenceHelper } from "../../../helpers/StepSequenceHelper";
import { BasePage } from "../../Base/BasePage";
import { AdminPanelLocators } from "./AdminPanelLocators";
import { DataHelper } from "../../../helpers/DataHelper";

export class AdminPanelPage extends BasePage {

    private readonly _adminPanelLocators: AdminPanelLocators;

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, dataHelper: DataHelper) {
        super("AdminPanel", browserHelper, stepSequenceHelper, dataHelper);
        this._adminPanelLocators = new AdminPanelLocators(browserHelper);
    }
    
    verifyLogoutIsVisible() {
        this.addStep("verifyLogIntoYourAccountIsVisible", async() => {
            console.log("Verifying \"Logout\" is visible");
            await expect(this._adminPanelLocators.logoutLink).toBeVisible();
        });
        return this;
    }
}