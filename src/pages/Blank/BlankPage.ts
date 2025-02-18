import { step } from "../../decorators/StepDecorator";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BrowserHelper } from "../../helpers/BrowserHelper";
import { BasePage } from "../Base/BasePage";
import { HomePage } from "../Home/HomePage";
import { LoginPage } from "../AutomationInTesting/Login/LoginPage";
import { AdminPanelPage } from "../AutomationInTesting/AdminPanel/AdminPanelPage";

export class BlankPage extends BasePage {
    
    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper) {
        super("BlankPage", browserHelper, stepSequenceHelper);
    }

    @step()
    async goToUiTestAutomationPlayground(homePage: HomePage) {
        console.log("goToUiTestAutomationPlayground");
        await this.workingTab.goto("http://uitestingplayground.com");
        return homePage;
    }

    goToUiTestAutomationPlayground_SS(homePage: HomePage) {
        this.addStep("goToUiTestAutomationPlayground_SS", async() => {
            console.log("goToUiTestAutomationPlayground_SS");
            await this.workingTab.goto("http://uitestingplayground.com");
        });
        return homePage;
    }

    goToAutomationInTesting<T extends LoginPage | AdminPanelPage>(landingpage: T) {
        this.addStep("goToAutomationInTesting", async() => {
            console.log("goToAutomationInTesting");
            await this.workingTab.goto("https://automationintesting.online/#/admin");
        });
        return landingpage;
    }
}