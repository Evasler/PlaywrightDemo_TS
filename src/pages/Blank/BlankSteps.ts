import errorSteps from "../Error/ErrorSteps";
import frameworkDataHelper from "../../helpers/data/FrameworkDataHelper";
import stepSequenceHelper from "../../helpers/chaining/StepSequenceHelper";
import browserHelper from "../../helpers/channel/BrowserHelper";
import adminPanelSteps from "../RestfulBooker/AdminPanel/AdminPanelSteps";
import loginSteps from "../RestfulBooker/Login/LoginSteps";

const blankSteps = {

    goToRestfulBookerAdminPage<T extends typeof loginSteps | typeof adminPanelSteps>(landingPage: T) {
        stepSequenceHelper.addStep("goToRestfulBooker", async() => {
            console.log("goToRestfulBooker");
            await browserHelper.workingTab.goto(`${frameworkDataHelper.baseUrl}admin`);
        });
        return landingPage;
    },

    goToJsErrorPage() {
        stepSequenceHelper.addStep("goToJsErrorPage", async() => {
            console.log("goToJsErrorPage");
            await browserHelper.workingTab.goto("data:text/html,<script>throw new Error(\"myJavaScriptError\")</script>");
        });
        return errorSteps;
    },

    goToInternalServerErrorPage() {
        stepSequenceHelper.addStep("goToInternalServerErrorPage", async() => {
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
    },

    goToConnectionErrorPage() {
        stepSequenceHelper.addStep("goToConnectionErrorPage", async() => {
            console.log("goToConnectionErrorPage");
            await browserHelper.workingTab.route(frameworkDataHelper.baseUrl, (route) => route.abort());
            await browserHelper.workingTab.goto(frameworkDataHelper.baseUrl);
        });
        return errorSteps;
    }
}

export default blankSteps;