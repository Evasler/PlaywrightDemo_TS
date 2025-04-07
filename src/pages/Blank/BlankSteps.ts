import StepSequenceHelper from "../../helpers/StepSequenceHelper";
import BrowserHelper from "../../helpers/BrowserHelper";
import BasePageSteps from "../Base/BasePageSteps";
import LoginSteps from "../RestfulBooker/Login/LoginSteps";
import AdminPanelSteps from "../RestfulBooker/AdminPanel/AdminPanelSteps";
import ErrorSteps from "../Error/ErrorSteps";
import TempDataHelper from "../../helpers/TempDataHelper";

export default class BlankSteps extends BasePageSteps {
    
    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, tempDataHelper: TempDataHelper, private readonly _baseUrl: string) {
        super("BlankPage", browserHelper, stepSequenceHelper, tempDataHelper);
    }

    goToRestfulBooker<T extends LoginSteps | AdminPanelSteps>(landingpage: T) {
        this.addStep("goToRestfulBooker", async() => {
            console.log("goToRestfulBooker");
            await this.workingTab.goto(`${this._baseUrl}admin`);
        });
        return landingpage;
    }

    goToJsErrorPage(errorPage: ErrorSteps) {
        this.addStep("goToJsErrorPage", async() => {
            console.log("goToJsErrorPage");
            await this.workingTab.goto("data:text/html,<script>throw new Error(\"myJavaScriptError\")</script>");
        });
        return errorPage;
    }

    goToInternalServerErrorPage(errorPage: ErrorSteps) {
        this.addStep("goToInternalServerErrorPage", async() => {
            console.log("goToInternalServerErrorPage");
            await this.workingTab.goto("https://httpstat.us/500");
        });
        return errorPage;
    }

    goToConnectionErrorPage(errorPage: ErrorSteps) {
        this.addStep("goToConnectionErrorPage", async() => {
            console.log("goToConnectionErrorPage");
            await this.workingTab.route(this._baseUrl, (route) => route.abort());
            await this.workingTab.goto(this._baseUrl);
        });
        return errorPage;
    }
}