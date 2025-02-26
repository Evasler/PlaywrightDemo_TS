import { BaseLocators } from "../Base/BaseLocators";
import { BrowserHelper } from "../../helpers/BrowserHelper";

export class HomePageLocators extends BaseLocators {

    constructor(browserHelper: BrowserHelper) { super(browserHelper) }

    get ajaxDataLink() { return this.workingTab.getByRole("link", {name: "AJAX Data", exact: true}) }
}