import BaseLocators from "../../Base/BaseLocators";
import BrowserHelper from "../../../helpers/channel/BrowserHelper";

export default class LoginLocators extends BaseLocators {

    constructor(browserHelper: BrowserHelper) { super(browserHelper) }

    get loginHeading() { return this.workingTab.getByRole("heading", { name: "Login", exact: true }); }
    get loginButton() { return this.workingTab.getByRole("button", { name: "Login", exact: true }); }

    textbox(name: string) { return this.workingTab.getByRole("textbox", { name: name, exact: true }); }
}