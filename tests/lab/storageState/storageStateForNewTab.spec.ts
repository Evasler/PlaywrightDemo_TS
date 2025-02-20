import { test } from "../../../src/fixtures/chainedPomFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

test.use( { errorListenerOptions: { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false } });
test.describe("Initial Page without storageState", () => {
    test(TestUtils.buildTestTitle(0, "Login page displayed, when the new tab is instantiated in the current context, which was instantiated without storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .goToAutomationInTesting(pageHelper.loginPage)
        .verifyLogIntoYourAccountIsVisible()
        .openNewTabInCurrentContext(pageHelper.blankPage)
        .goToAutomationInTesting(pageHelper.loginPage)
        .verifyLogIntoYourAccountIsVisible()
        .execute();
    });
    test(TestUtils.buildTestTitle(1, "Login page displayed, when the new tab is instantiated in a new context without storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .goToAutomationInTesting(pageHelper.loginPage)
        .verifyLogIntoYourAccountIsVisible()
        .openNewTabInNewContext(pageHelper.blankPage)
        .goToAutomationInTesting(pageHelper.loginPage)
        .verifyLogIntoYourAccountIsVisible()
        .execute();
    });
    test(TestUtils.buildTestTitle(2, "Admin Panel page displayed, when the new tab is instantiated in a new context with storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .goToAutomationInTesting(pageHelper.loginPage)
        .verifyLogIntoYourAccountIsVisible()
        .openNewTabInNewContext(pageHelper.blankPage, "administrator")
        .goToAutomationInTesting(pageHelper.adminPanelPage)
        .verifyLogoutIsVisible()
        .execute();
    });
});

test.describe("Starting Page with storageState", () => {
    test.use({ sharedStorageStateUser: "administrator" });
    test(TestUtils.buildTestTitle(3, "Admin Panel page displayed, when the new tab is instantiated in the current context, which was instantiated with storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .goToAutomationInTesting(pageHelper.adminPanelPage)
        .verifyLogoutIsVisible()
        .openNewTabInCurrentContext(pageHelper.blankPage)
        .goToAutomationInTesting(pageHelper.adminPanelPage)
        .verifyLogoutIsVisible()
        .execute();
    });
    test(TestUtils.buildTestTitle(4, "Login page displayed, when the new tab is instantiated in a new context without storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .goToAutomationInTesting(pageHelper.adminPanelPage)
        .verifyLogoutIsVisible()
        .openNewTabInNewContext(pageHelper.blankPage)
        .goToAutomationInTesting(pageHelper.loginPage)
        .verifyLogIntoYourAccountIsVisible()
        .execute();
    });
    test(TestUtils.buildTestTitle(5, "Admin Panel page displayed, when the new tab is instantiated in a new context with storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .goToAutomationInTesting(pageHelper.adminPanelPage)
        .verifyLogoutIsVisible()
        .openNewTabInNewContext(pageHelper.blankPage, "administrator")
        .goToAutomationInTesting(pageHelper.adminPanelPage)
        .verifyLogoutIsVisible()
        .execute();
    });
});
