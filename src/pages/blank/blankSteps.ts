import type { ErrorSteps } from "../error/errorSteps.js";
import type { AdminPanelSteps } from "../restfulBooker/adminPanel/adminPanelSteps.js";
import type { LoginSteps } from "../restfulBooker/login/loginSteps.js";
import frameworkDataHelper from "../../helpers/data/frameworkDataHelper.js";
import browserHelper from "../../helpers/channel/browserHelper.js";
import BaseSteps from "../base/baseSteps.js";

class BlankSteps extends BaseSteps {

    constructor() { super("BlankPage"); }

    goToRestfulBookerAdminPage<T extends LoginSteps | AdminPanelSteps>(landingPage: T) {
        this.addStep("goToRestfulBooker", async() => {
            console.log("goToRestfulBooker");
            await browserHelper.workingTab.goto(`${frameworkDataHelper.baseUrl}admin`);
        });
        return landingPage;
    }

    goToJsErrorPage(errorSteps: ErrorSteps) {
        this.addStep("goToJsErrorPage", async() => {
            console.log("goToJsErrorPage");
            await browserHelper.workingTab.goto(`data:text/html,<script>throw new Error("myJavaScriptError")</script>`);
        });
        return errorSteps;
    }

    goToInternalServerErrorPage(errorSteps: ErrorSteps) {
        this.addStep("goToInternalServerErrorPage", async() => {
            console.log("goToInternalServerErrorPage");
            await browserHelper.workingTab.route(frameworkDataHelper.baseUrl, async (route) => {
                const response = await route.fetch();
                await route.fulfill({
                    response: response,
                    status: 500
                })
            });
            await browserHelper.workingTab.goto(frameworkDataHelper.baseUrl);
        });
        return errorSteps;
    }

    goToConnectionErrorPage(errorSteps: ErrorSteps) {
        this.addStep("goToConnectionErrorPage", async() => {
            console.log("goToConnectionErrorPage");
            await browserHelper.workingTab.route(frameworkDataHelper.baseUrl, (route) => route.abort());
            await browserHelper.workingTab.goto(frameworkDataHelper.baseUrl);
        });
        return errorSteps;
    }
}

export default new BlankSteps();
export type { BlankSteps };