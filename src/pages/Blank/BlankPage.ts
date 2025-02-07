import { TestManager } from "../../managers/TestManager";
import { BasePage } from "../Base/BasePage";
import { HomePage } from "../Home/HomePage";

export class BlankPage extends BasePage {

    constructor(testManager: TestManager) {
        super("BlankPage", testManager);
    }

    goToUiTestAutomationPlayground(homePage: HomePage) {
        this.addStep(async() => {
            await this.workingTab.goto("/");
        });
        return homePage;
    }
}