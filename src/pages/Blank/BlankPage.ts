import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BrowserHelper } from "../../helpers/BrowserHelper";
import { BasePage } from "../Base/BasePage";
import { HomePage } from "../UITestingPlayground/Home/HomePage";
import { LoginPage } from "../RestfulBooker/Login/LoginPage";
import { AdminPanelPage } from "../RestfulBooker/AdminPanel/AdminPanelPage";
import { ErrorPage } from "../Error/ErrorPage";
import { TempDataHelper } from "../../helpers/TempDataHelper";

export class BlankPage extends BasePage {
    
    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, tempDataHelper: TempDataHelper) {
        super("BlankPage", browserHelper, stepSequenceHelper, tempDataHelper);
    }

    goToUiTestAutomationPlayground(homePage: HomePage) {
        this.addStep("goToUiTestAutomationPlayground", async() => {
            console.log("goToUiTestAutomationPlayground");
            await this.workingTab.goto("http://uitestingplayground.com");
        });
        return homePage;
    }

    goToRestfulBooker<T extends LoginPage | AdminPanelPage>(landingpage: T) {
        this.addStep("goToRestfulBooker", async() => {
            console.log("goToRestfulBooker");
            await this.workingTab.goto("https://automationintesting.online/admin");
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