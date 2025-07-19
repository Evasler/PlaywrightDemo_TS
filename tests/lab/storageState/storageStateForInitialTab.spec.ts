import extendedTest from "../../../src/fixtures/extendedTest.js";
import { stepSequenceHelper } from "../../../src/helpers/index.js";
import { adminPanelSteps, blankSteps, loginSteps } from "../../../src/pages/index.js";
import { testUtils } from "../../../src/utils/index.js";

extendedTest.use( { errorListenerOptions: { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false } });
extendedTest.describe("Initial Tab without storageState", () => {
    extendedTest(testUtils.fullTitle(0, "Login page displayed, when initial tab is instantiated without a storageState"), async({ openNewTabInNewContext }) => {
        openNewTabInNewContext(blankSteps)
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible();
        await stepSequenceHelper.stepSequence;
    });
});

extendedTest.describe("Initial Tab with storageState", () => {
    extendedTest(testUtils.fullTitle(1, "Admin Panel displayed, when initial tab is instantiated with a storageState"), async({ openNewTabInNewContext }) => {
        openNewTabInNewContext(blankSteps, "administrator")
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms");
        await stepSequenceHelper.stepSequence;
    });
});