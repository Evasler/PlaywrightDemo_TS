import uiTest from "../../../src/fixtures/uiFixtures";
import TestUtils from "../../../src/utils/TestUtils";

uiTest.use( { errorListenerOptions: { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false } });
uiTest.describe("Initial Tab without storageState", () => {
    uiTest(TestUtils.fullTitle(0, "Login page displayed, when initial tab is instantiated without a storageState"), async({ ui }) => {
        await ui
        ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps)
        .goToRestfulBooker(ui.pageStepsHelper.loginSteps)
        .verifyLoginIsVisible()
        ._execute();
    });
});

uiTest.describe("Initial Tab with storageState", () => {
    uiTest(TestUtils.fullTitle(1, "Admin Panel displayed, when initial tab is instantiated with a storageState"), async({ ui }) => {
        await ui
        ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps, "administrator")
        .goToRestfulBooker(ui.pageStepsHelper.adminPanelSteps)
        .verifyLinkIsVisible("Rooms")
        ._execute();
    });
});