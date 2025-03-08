import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BrowserHelper } from "../../helpers/BrowserHelper";
import { BasePage } from "../Base/BasePage";
import { HomePage } from "../UITestingPlayground/Home/HomePage";
import { LoginPage } from "../AutomationInTesting/Login/LoginPage";
import { AdminPanelPage } from "../AutomationInTesting/AdminPanel/AdminPanelPage";
import { ErrorPage } from "../Error/ErrorPage";
import { DataHelper } from "../../helpers/DataHelper";

export class BlankPage extends BasePage {
    
    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, dataHelper: DataHelper) {
        super("BlankPage", browserHelper, stepSequenceHelper, dataHelper);
    }

    goToUiTestAutomationPlayground(homePage: HomePage) {
        this.addStep("goToUiTestAutomationPlayground", async() => {
            console.log("goToUiTestAutomationPlayground");
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

    goToJsErrorPage(errorPage: ErrorPage) {
        this.addStep("goToJsErrorPage", async() => {
            console.log("goToJsErrorPage");
            await this.workingTab.goto("data:text/html,<script>throw new Error(\"myJavaScriptError\")</script>");
        });
        return errorPage;
    }

    goToInternalServerErrorPage(errorPage: ErrorPage) {
        this.addStep("goToInternalServerErrorPage", async() => {
            console.log("goToInternalServerErrorPage");
            await this.workingTab.goto("https://httpstat.us/500");
        });
        return errorPage;
    }

    goToConnectionErrorPage(errorPage: ErrorPage) {
        this.addStep("goToConnectionErrorPage", async() => {
            console.log("goToConnectionErrorPage");
            await this.workingTab.route("http://uitestingplayground.com/", (route) => route.abort());
            await this.workingTab.goto("http://uitestingplayground.com/");
        });
        return errorPage;
    }
}