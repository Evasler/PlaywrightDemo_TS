import { BaseLocators } from "../../Base/BaseLocators";
import { BrowserHelper } from "../../../helpers/BrowserHelper";

export class LoginLocators extends BaseLocators {

    constructor(browserHelper: BrowserHelper) { super(browserHelper) }

    get logIntoYourAccountHeading() { return this.workingTab.getByRole("heading", {name: "Log into your account", exact: true}) }
}