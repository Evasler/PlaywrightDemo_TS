import uiTest from "../../../src/fixtures/uiFixtures";
import stepSequenceHelper from "../../../src/helpers/chaining/StepSequenceHelper";
import browserHelper from "../../../src/helpers/channel/BrowserHelper";
import blankSteps from "../../../src/pages/Blank/BlankSteps";
import adminPanelSteps from "../../../src/pages/RestfulBooker/AdminPanel/AdminPanelSteps";
import loginSteps from "../../../src/pages/RestfulBooker/Login/LoginSteps";
import testUtils from "../../../src/utils/TestUtils";

uiTest.use( { errorListenerOptions: { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false } });
uiTest.describe("Initial Tab without storageState", () => {
    uiTest(testUtils.fullTitle(0, "Login page displayed, when initial tab is instantiated without a storageState"), async() => {
        browserHelper.openNewTabInNewContext();
        blankSteps
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible();
        await stepSequenceHelper.stepSequence;
    });
});

uiTest.describe("Initial Tab with storageState", () => {
    uiTest(testUtils.fullTitle(1, "Admin Panel displayed, when initial tab is instantiated with a storageState"), async() => {
        browserHelper.openNewTabInNewContext("administrator");
        blankSteps
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms");
        await stepSequenceHelper.stepSequence;
    });
});