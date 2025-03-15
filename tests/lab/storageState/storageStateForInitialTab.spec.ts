import { test } from "../../../src/fixtures/chainedPomFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

test.use( { errorListenerOptions: { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false } });
test.describe("Initial Tab without storageState", () => {
    test(TestUtils.buildTestTitle(0, "Login page displayed, when initial tab is instantiated without a storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .openNewTabInNewContext(pageHelper.blankPage)
        .goToRestfulBooker(pageHelper.loginPage)
        .verifyLoginIsVisible()
        .execute();
    });
});

test.describe("Initial Tab with storageState", () => {
    test(TestUtils.buildTestTitle(1, "Admin Panel displayed, when initial tab is instantiated with a storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .openNewTabInNewContext(pageHelper.blankPage, "administrator")
        .goToRestfulBooker(pageHelper.adminPanelPage)
        .verifyLinkIsVisible("Rooms")
        .execute();
    });
});