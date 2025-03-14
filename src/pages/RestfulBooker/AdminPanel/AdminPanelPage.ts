import { expect } from "@playwright/test";
import { BrowserHelper } from "../../../helpers/BrowserHelper";
import { StepSequenceHelper } from "../../../helpers/StepSequenceHelper";
import { BasePage } from "../../Base/BasePage";
import { AdminPanelLocators } from "./AdminPanelLocators";
import { TempDataHelper } from "../../../helpers/TempDataHelper";

export class AdminPanelPage extends BasePage {

    private readonly _adminPanelLocators: AdminPanelLocators;

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, tempDataHelper: TempDataHelper) {
        super("AdminPanel", browserHelper, stepSequenceHelper, tempDataHelper);
        this._adminPanelLocators = new AdminPanelLocators(browserHelper);
    }
    
    verifyLinkIsVisible(name: string) {
        this.addStep("verifyLinkIsVisible", async() => {
            console.log(`Verifying \"${name}\" link is visible`);
            await expect(this._adminPanelLocators.link(name)).toBeVisible();
        });
        return this;
    }
}