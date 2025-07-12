import uiTest from "../../../src/fixtures/uiFixtures";
import stepSequenceHelper from "../../../src/helpers/chaining/stepSequenceHelper";
import browserHelper from "../../../src/helpers/channel/browserHelper";
import blankSteps from "../../../src/pages/Blank/BlankSteps";
import adminPanelSteps from "../../../src/pages/restfulBooker/adminPanel/adminPanelSteps";
import loginSteps from "../../../src/pages/restfulBooker/login/loginSteps";
import testUtils from "../../../src/utils/testUtils";

uiTest.use( { errorListenerOptions: { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false } });
uiTest.describe("Initial Page without storageState", () => {
    uiTest(testUtils.fullTitle(0, "Login page displayed, when the new tab is instantiated in the current context, which was instantiated without storageState"), async() => {
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
    uiTest(testUtils.fullTitle(1, "Login page displayed, when the new tab is instantiated in a new context without storageState"), async() => {
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
    uiTest(testUtils.fullTitle(2, "Admin Panel page displayed, when the new tab is instantiated in a new context with storageState"), async() => {
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

uiTest.describe("Starting Page with storageState", () => {
    uiTest(testUtils.fullTitle(3, "Admin Panel page displayed, when the new tab is instantiated in the current context, which was instantiated with storageState"), async() => {
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
    uiTest(testUtils.fullTitle(4, "Login page displayed, when the new tab is instantiated in a new context without storageState"), async() => {
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
    uiTest(testUtils.fullTitle(5, "Admin Panel page displayed, when the new tab is instantiated in a new context with storageState"), async() => {
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
