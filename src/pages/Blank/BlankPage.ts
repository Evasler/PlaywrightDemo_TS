import { step } from "../../decorators/StepDecorator";
import { StepSequenceManager } from "../../managers/StepSequenceManager";
import { TestManager } from "../../managers/TestManager";
import { BasePage } from "../Base/BasePage";
import { HomePage } from "../Home/HomePage";

export class BlankPage extends BasePage {
    
    constructor(testManager: TestManager, stepSequenceManager: StepSequenceManager) {
        super("BlankPage", testManager, stepSequenceManager);
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