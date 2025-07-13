import extendedTest from "../../../src/fixtures/extendedTest";
import stepSequenceHelper from "../../../src/helpers/chaining/stepSequenceHelper";
import browserHelper from "../../../src/helpers/channel/browserHelper";
import blankSteps from "../../../src/pages/blank/blankSteps";
import adminPanelSteps from "../../../src/pages/restfulBooker/adminPanel/adminPanelSteps";
import loginSteps from "../../../src/pages/restfulBooker/login/loginSteps";
import testUtils from "../../../src/utils/testUtils";

extendedTest.use( { errorListenerOptions: { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false } });
extendedTest.describe("Initial Tab without storageState", () => {
    extendedTest(testUtils.fullTitle(0, "Login page displayed, when initial tab is instantiated without a storageState"), async() => {
        browserHelper.openNewTabInNewContext();
        blankSteps
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible();
        await stepSequenceHelper.stepSequence;
    });
});

extendedTest.describe("Initial Tab with storageState", () => {
    extendedTest(testUtils.fullTitle(1, "Admin Panel displayed, when initial tab is instantiated with a storageState"), async() => {
        browserHelper.openNewTabInNewContext("administrator");
        blankSteps
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms");
        await stepSequenceHelper.stepSequence;
    });
});