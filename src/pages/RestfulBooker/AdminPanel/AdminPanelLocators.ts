import { BaseLocators } from "../../Base/BaseLocators";
import { BrowserHelper } from "../../../helpers/BrowserHelper";

export class AdminPanelLocators extends BaseLocators {

    constructor(browserHelper: BrowserHelper) { super(browserHelper) }

    link(name: string) { return this.workingTab.getByRole("link", {name: name, exact: true}) }
}