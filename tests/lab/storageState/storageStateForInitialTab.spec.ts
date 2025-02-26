import { test } from "../../../src/fixtures/chainedPomFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

test.use( { errorListenerOptions: { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false } });
test.describe("Initial Tab without storageState", () => {
    test(TestUtils.buildTestTitle(0, "Login page displayed, when initial tab isn't instantiated with a storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .goToAutomationInTesting(pageHelper.loginPage)
        .verifyLogIntoYourAccountIsVisible()
        .execute();
    });
});

test.describe("Initial Tab with storageState", () => {
    test.use({ sharedUser: "administrator" });
    test(TestUtils.buildTestTitle(1, "Admin Panel displayed, when initial tab is instantiated with a storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .goToAutomationInTesting(pageHelper.adminPanelPage)
        .verifyLogoutIsVisible()
        .execute();
    });
});