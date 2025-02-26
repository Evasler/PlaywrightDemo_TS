import { BaseLocators } from "../../Base/BaseLocators";
import { BrowserHelper } from "../../../helpers/BrowserHelper";

export class AdminPanelLocators extends BaseLocators {

    constructor(browserHelper: BrowserHelper) { super(browserHelper) }

    get logoutLink() { return this.workingTab.getByRole("link", {name: "Logout", exact: true}) }
}