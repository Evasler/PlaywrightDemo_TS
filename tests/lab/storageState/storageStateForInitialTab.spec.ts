import uiTest from "../../../src/fixtures/uiFixtures";
import stepSequenceHelper from "../../../src/helpers/chaining/stepSequenceHelper";
import browserHelper from "../../../src/helpers/channel/browserHelper";
import blankSteps from "../../../src/pages/Blank/BlankSteps";
import adminPanelSteps from "../../../src/pages/restfulBooker/adminPanel/adminPanelSteps";
import loginSteps from "../../../src/pages/restfulBooker/login/loginSteps";
import testUtils from "../../../src/utils/testUtils";

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