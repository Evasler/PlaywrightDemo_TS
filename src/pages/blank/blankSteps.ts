import errorSteps from "../error/errorSteps";
import frameworkDataHelper from "../../helpers/data/frameworkDataHelper";
import stepSequenceHelper from "../../helpers/chaining/stepSequenceHelper";
import browserHelper from "../../helpers/channel/browserHelper";
import adminPanelSteps from "../restfulBooker/adminPanel/adminPanelSteps";
import loginSteps from "../restfulBooker/login/loginSteps";

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