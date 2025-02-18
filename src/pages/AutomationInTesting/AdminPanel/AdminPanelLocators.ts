import { BrowserHelper } from "../../../helpers/BrowserHelper";

export class AdminPanelLocators {

    constructor(private readonly browserHelper: BrowserHelper) { }
    
    private get page() {
        return this.browserHelper.workingTab;
    }

    get logoutLink() { return this.page.getByRole("link", {name: "Logout", exact: true}) }
}