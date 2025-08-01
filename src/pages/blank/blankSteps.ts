import type { ErrorSteps } from "../error/errorSteps.js";
import type { AdminPanelSteps } from "../restfulBooker/adminPanel/adminPanelSteps.js";
import type { LoginSteps } from "../restfulBooker/login/loginSteps.js";
import BaseSteps from "../base/baseSteps.js";
import frameworkDataHelper from "../../helpers/data/frameworkDataHelper.js";

class BlankSteps extends BaseSteps {

    constructor() { super("BlankPage"); }

    goToRestfulBookerAdminPage<T extends LoginSteps | AdminPanelSteps>(landingPage: T) {
        this.addStep("Going to Restful Booker Admin Page", async() => {
            console.log("Going to Restful Booker Admin Page");
            await this.workingTab.goto(`${frameworkDataHelper.baseUrl}admin`);
        });
        return landingPage;
    }

    goToJsErrorPage(errorSteps: ErrorSteps) {
        this.addStep("Going to JavaScript Error Page", async() => {
            console.log("Going to JavaScript Error Page");
            await this.workingTab.goto(`data:text/html,<script>throw new Error("myJavaScriptError")</script>`);
        });
        return errorSteps;
    }

    goToInternalServerErrorPage(errorSteps: ErrorSteps) {
        this.addStep("Going to Internal Server Error Page", async() => {
            console.log("Going to Internal Server Error Page");
            await this.workingTab.route(frameworkDataHelper.baseUrl, async (route) => {
                const response = await route.fetch();
                await route.fulfill({
                    response: response,
                    status: 500
                })
            });
            await this.workingTab.goto(frameworkDataHelper.baseUrl);
        });
        return errorSteps;
    }

    goToConnectionErrorPage(errorSteps: ErrorSteps) {
        this.addStep("Going to Connection Error Page", async() => {
            console.log("Going to Connection Error Page");
            await this.workingTab.route(frameworkDataHelper.baseUrl, (route) => route.abort());
            await this.workingTab.goto(frameworkDataHelper.baseUrl);
        });
        return errorSteps;
    }
}

export default new BlankSteps();
export type { BlankSteps };