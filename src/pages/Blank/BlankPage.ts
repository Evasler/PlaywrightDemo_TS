import StepSequenceHelper from "../../helpers/StepSequenceHelper";
import BrowserHelper from "../../helpers/BrowserHelper";
import BasePage from "../Base/BasePage";
import LoginPage from "../RestfulBooker/Login/LoginPage";
import AdminPanelPage from "../RestfulBooker/AdminPanel/AdminPanelPage";
import ErrorPage from "../Error/ErrorPage";
import TempDataHelper from "../../helpers/TempDataHelper";

export default class BlankPage extends BasePage {
    
    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, tempDataHelper: TempDataHelper, private readonly _baseUrl: string) {
        super("BlankPage", browserHelper, stepSequenceHelper, tempDataHelper);
    }

    goToRestfulBooker<T extends LoginPage | AdminPanelPage>(landingpage: T) {
        this.addStep("goToRestfulBooker", async() => {
            console.log("goToRestfulBooker");
            await this.workingTab.goto(`${this._baseUrl}admin`);
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
            await this.workingTab.route(this._baseUrl, (route) => route.abort());
            await this.workingTab.goto(this._baseUrl);
        });
        return errorPage;
    }
}