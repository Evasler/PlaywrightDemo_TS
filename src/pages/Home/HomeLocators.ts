import { TestManager } from "../../managers/TestManager";

export class HomePageLocators {

    constructor(private readonly testManager: TestManager) { }
    private get page() {
        return this.testManager.workingPage;
    }

    get ajaxDataLink() { return this.page.getByRole("link", {name: "AJAX Data", exact: true}) }
}