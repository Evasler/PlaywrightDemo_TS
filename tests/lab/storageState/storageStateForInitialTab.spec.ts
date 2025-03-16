import { uiTest } from "../../../src/fixtures/uiFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

uiTest.use( { errorListenerOptions: { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false } });
uiTest.describe("Initial Tab without storageState", () => {
    uiTest(TestUtils.buildTestTitle(0, "Login page displayed, when initial tab is instantiated without a storageState"), async({ ui }) => {
        await ui
        .openNewTabInNewContext(ui.pageHelper.blankPage)
        .goToRestfulBooker(ui.pageHelper.loginPage)
        .verifyLoginIsVisible()
        .execute();
    });
});

uiTest.describe("Initial Tab with storageState", () => {
    uiTest(TestUtils.buildTestTitle(1, "Admin Panel displayed, when initial tab is instantiated with a storageState"), async({ ui }) => {
        await ui
        .openNewTabInNewContext(ui.pageHelper.blankPage, "administrator")
        .goToRestfulBooker(ui.pageHelper.adminPanelPage)
        .verifyLinkIsVisible("Rooms")
        .execute();
    });
});