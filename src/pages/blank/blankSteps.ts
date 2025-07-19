import type { ErrorSteps } from "../error/errorSteps.js";
import type { AdminPanelSteps } from "../restfulBooker/adminPanel/adminPanelSteps.js";
import type { LoginSteps } from "../restfulBooker/login/loginSteps.js";
import BaseSteps from "../base/baseSteps.js";
import { frameworkDataHelper } from "../../helpers/index.js";

class BlankSteps extends BaseSteps {

    constructor() { super("BlankPage"); }

    goToRestfulBookerAdminPage<T extends LoginSteps | AdminPanelSteps>(landingPage: T) {
        this.addStep("goToRestfulBooker", async() => {
            console.log("goToRestfulBooker");
            await this.workingTab.goto(`${frameworkDataHelper.baseUrl}admin`);
        });
        return landingPage;
    }

    goToJsErrorPage(errorSteps: ErrorSteps) {
        this.addStep("goToJsErrorPage", async() => {
            console.log("goToJsErrorPage");
            await this.workingTab.goto(`data:text/html,<script>throw new Error("myJavaScriptError")</script>`);
        });
        return errorSteps;
    }

    goToInternalServerErrorPage(errorSteps: ErrorSteps) {
        this.addStep("goToInternalServerErrorPage", async() => {
            console.log("goToInternalServerErrorPage");
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
        this.addStep("goToConnectionErrorPage", async() => {
            console.log("goToConnectionErrorPage");
            await this.workingTab.route(frameworkDataHelper.baseUrl, (route) => route.abort());
            await this.workingTab.goto(frameworkDataHelper.baseUrl);
        });
        return errorSteps;
    }
}

export default new BlankSteps();
export type { BlankSteps };