import uiTest from "../../../src/fixtures/uiFixtures";
import TestUtils from "../../../src/utils/TestUtils";

uiTest.use( { errorListenerOptions: { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false } });
uiTest.describe("Initial Page without storageState", () => {
    uiTest(TestUtils.fullTitle(0, "Login page displayed, when the new tab is instantiated in the current context, which was instantiated without storageState"), async({ ui }) => {
        await ui
        ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps)
        .goToRestfulBooker(ui.pageStepsHelper.loginSteps)
        .verifyLoginIsVisible()
        ._openNewTabInCurrentContext(ui.pageStepsHelper.blankSteps)
        .goToRestfulBooker(ui.pageStepsHelper.loginSteps)
        .verifyLoginIsVisible()
        ._execute();
    });
    uiTest(TestUtils.fullTitle(1, "Login page displayed, when the new tab is instantiated in a new context without storageState"), async({ ui }) => {
        await ui
        ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps)
        .goToRestfulBooker(ui.pageStepsHelper.loginSteps)
        .verifyLoginIsVisible()
        ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps)
        .goToRestfulBooker(ui.pageStepsHelper.loginSteps)
        .verifyLoginIsVisible()
        ._execute();
    });
    uiTest(TestUtils.fullTitle(2, "Admin Panel page displayed, when the new tab is instantiated in a new context with storageState"), async({ ui }) => {
        await ui
        ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps)
        .goToRestfulBooker(ui.pageStepsHelper.loginSteps)
        .verifyLoginIsVisible()
        ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps, "administrator")
        .goToRestfulBooker(ui.pageStepsHelper.adminPanelSteps)
        .verifyLinkIsVisible("Rooms")
        ._execute();
    });
});

uiTest.describe("Starting Page with storageState", () => {
    uiTest(TestUtils.fullTitle(3, "Admin Panel page displayed, when the new tab is instantiated in the current context, which was instantiated with storageState"), async({ ui }) => {
        await ui
        ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps, "administrator")
        .goToRestfulBooker(ui.pageStepsHelper.adminPanelSteps)
        .verifyLinkIsVisible("Rooms")
        ._openNewTabInCurrentContext(ui.pageStepsHelper.blankSteps)
        .goToRestfulBooker(ui.pageStepsHelper.adminPanelSteps)
        .verifyLinkIsVisible("Rooms")
        ._execute();
    });
    uiTest(TestUtils.fullTitle(4, "Login page displayed, when the new tab is instantiated in a new context without storageState"), async({ ui }) => {
        await ui
        ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps, "administrator")
        .goToRestfulBooker(ui.pageStepsHelper.adminPanelSteps)
        .verifyLinkIsVisible("Rooms")
        ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps)
        .goToRestfulBooker(ui.pageStepsHelper.loginSteps)
        .verifyLoginIsVisible()
        ._execute();
    });
    uiTest(TestUtils.fullTitle(5, "Admin Panel page displayed, when the new tab is instantiated in a new context with storageState"), async({ ui }) => {
        await ui
        ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps, "administrator")
        .goToRestfulBooker(ui.pageStepsHelper.adminPanelSteps)
        .verifyLinkIsVisible("Rooms")
        ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps, "administrator")
        .goToRestfulBooker(ui.pageStepsHelper.adminPanelSteps)
        .verifyLinkIsVisible("Rooms")
        ._execute();
    });
});
