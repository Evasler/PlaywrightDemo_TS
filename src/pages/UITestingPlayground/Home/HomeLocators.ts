import BaseLocators from "../../Base/BaseLocators";
import BrowserHelper from "../../../helpers/BrowserHelper";

export default class HomeLocators extends BaseLocators {

    constructor(browserHelper: BrowserHelper) { super(browserHelper) }

    get ajaxDataLink() { return this.workingTab.getByRole("link", {name: "AJAX Data", exact: true}) }
}