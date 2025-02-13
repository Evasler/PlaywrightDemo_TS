import { BrowserHelper } from "../../helpers/BrowserHelper";

export class HomePageLocators {

    constructor(private readonly browserHelper: BrowserHelper) { }
    private get page() {
        return this.browserHelper.workingTab;
    }

    get ajaxDataLink() { return this.page.getByRole("link", {name: "AJAX Data", exact: true}) }
}