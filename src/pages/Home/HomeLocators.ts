import { BrowserManager } from "../../managers/BrowserManager";

export class HomePageLocators {

    constructor(private readonly browserManager: BrowserManager) { }
    private get page() {
        return this.browserManager.workingTab;
    }

    get ajaxDataLink() { return this.page.getByRole("link", {name: "AJAX Data", exact: true}) }
}