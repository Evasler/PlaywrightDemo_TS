import { BrowserHelper } from "../../../helpers/BrowserHelper";

export class LoginLocators {

    constructor(private readonly browserHelper: BrowserHelper) { }

    private get page() { return this.browserHelper.workingTab; }

    get logIntoYourAccountHeading() { return this.page.getByRole("heading", {name: "Log into your account", exact: true}) }
}