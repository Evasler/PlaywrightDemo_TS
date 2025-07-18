import extendedTest from "../../../src/fixtures/extendedTest.js";
import stepSequenceHelper from "../../../src/helpers/chaining/stepSequenceHelper.js";
import browserHelper from "../../../src/helpers/channel/browserHelper.js";
import blankSteps from "../../../src/pages/blank/blankSteps.js";
import adminPanelSteps from "../../../src/pages/restfulBooker/adminPanel/adminPanelSteps.js";
import loginSteps from "../../../src/pages/restfulBooker/login/loginSteps.js";
import testUtils from "../../../src/utils/testUtils.js";

extendedTest.use( { errorListenerOptions: { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false } });
extendedTest.describe("Initial Page without storageState", () => {
    extendedTest(testUtils.fullTitle(0, "Login page displayed, when the new tab is instantiated in the current context, which was instantiated without storageState"), async() => {
        browserHelper.openNewTabInNewContext();
        blankSteps
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible();
        browserHelper.openNewTabInCurrentContext();
        blankSteps
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible();
        await stepSequenceHelper.stepSequence;
    });
    extendedTest(testUtils.fullTitle(1, "Login page displayed, when the new tab is instantiated in a new context without storageState"), async() => {
        browserHelper.openNewTabInNewContext();
        blankSteps
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible();
        browserHelper.openNewTabInNewContext();
        blankSteps
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible();
        await stepSequenceHelper.stepSequence;
    });
    extendedTest(testUtils.fullTitle(2, "Admin Panel page displayed, when the new tab is instantiated in a new context with storageState"), async() => {
        browserHelper.openNewTabInNewContext();
        blankSteps
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible();
        browserHelper.openNewTabInNewContext("administrator");
        blankSteps
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms");
        await stepSequenceHelper.stepSequence;
    });
});

extendedTest.describe("Starting Page with storageState", () => {
    extendedTest(testUtils.fullTitle(3, "Admin Panel page displayed, when the new tab is instantiated in the current context, which was instantiated with storageState"), async() => {
        browserHelper.openNewTabInNewContext("administrator");
        blankSteps
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms");
        browserHelper.openNewTabInCurrentContext();
        blankSteps
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms");
        await stepSequenceHelper.stepSequence;
    });
    extendedTest(testUtils.fullTitle(4, "Login page displayed, when the new tab is instantiated in a new context without storageState"), async() => {
        browserHelper.openNewTabInNewContext("administrator");
        blankSteps
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms")
        browserHelper.openNewTabInNewContext();
        blankSteps
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible();
        await stepSequenceHelper.stepSequence;
    });
    extendedTest(testUtils.fullTitle(5, "Admin Panel page displayed, when the new tab is instantiated in a new context with storageState"), async() => {
        browserHelper.openNewTabInNewContext("administrator");
        blankSteps
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms");
        browserHelper.openNewTabInNewContext("administrator");
        blankSteps
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms");
        await stepSequenceHelper.stepSequence;
    });
});
