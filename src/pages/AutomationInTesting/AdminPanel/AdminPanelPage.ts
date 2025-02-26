import { expect } from "@playwright/test";
import { BrowserHelper } from "../../../helpers/BrowserHelper";
import { StepSequenceHelper } from "../../../helpers/StepSequenceHelper";
import { BasePage } from "../../Base/BasePage";
import { AdminPanelLocators } from "./AdminPanelLocators";
import { StorageStateHelper } from "../../../helpers/StorageStateHelper";

export class AdminPanelPage extends BasePage {

    private readonly adminPanelLocators: AdminPanelLocators;

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, storageStateHelper: StorageStateHelper) {
        super("AdminPanel", browserHelper, stepSequenceHelper, storageStateHelper);
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