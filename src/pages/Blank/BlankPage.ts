import { step } from "../../decorators/StepDecorator";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BrowserHelper } from "../../helpers/BrowserHelper";
import { BasePage } from "../Base/BasePage";
import { HomePage } from "../Home/HomePage";

export class BlankPage extends BasePage {
    
    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper) {
        super("BlankPage", browserHelper, stepSequenceHelper);
    }

    goToUiTestAutomationPlayground_SS(homePage: HomePage) {
        this.addStep("goToUiTestAutomationPlayground_SS", async() => {
            console.log("goToUiTestAutomationPlayground_SS");
            await this.workingTab.goto("/");
        });
        return homePage;
    }

    @step()
    async goToUiTestAutomationPlayground(homePage: HomePage) {
        console.log("goToUiTestAutomationPlayground");
        await this.workingTab.goto("/");
        return homePage;
    }
}