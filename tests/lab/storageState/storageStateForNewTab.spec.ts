import { test } from "../../../src/fixtures/chainedPomFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

test.use( { errorListenerOptions: { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false } });
test.describe("Initial Page without storageState", () => {
    test(TestUtils.buildTestTitle(0, "Login page displayed, when the new tab is instantiated in the current context, which was instantiated without storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .openNewTabInNewContext(pageHelper.blankPage)
        .goToRestfulBooker(pageHelper.loginPage)
        .verifyLoginIsVisible()
        .openNewTabInCurrentContext(pageHelper.blankPage)
        .goToRestfulBooker(pageHelper.loginPage)
        .verifyLoginIsVisible()
        .execute();
    });
    test(TestUtils.buildTestTitle(1, "Login page displayed, when the new tab is instantiated in a new context without storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .openNewTabInNewContext(pageHelper.blankPage)
        .goToRestfulBooker(pageHelper.loginPage)
        .verifyLoginIsVisible()
        .openNewTabInNewContext(pageHelper.blankPage)
        .goToRestfulBooker(pageHelper.loginPage)
        .verifyLoginIsVisible()
        .execute();
    });
    test(TestUtils.buildTestTitle(2, "Admin Panel page displayed, when the new tab is instantiated in a new context with storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .openNewTabInNewContext(pageHelper.blankPage)
        .goToRestfulBooker(pageHelper.loginPage)
        .verifyLoginIsVisible()
        .openNewTabInNewContext(pageHelper.blankPage, "administrator")
        .goToRestfulBooker(pageHelper.adminPanelPage)
        .verifyLinkIsVisible("Rooms")
        .execute();
    });
});

test.describe("Starting Page with storageState", () => {
    test(TestUtils.buildTestTitle(3, "Admin Panel page displayed, when the new tab is instantiated in the current context, which was instantiated with storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .openNewTabInNewContext(pageHelper.blankPage, "administrator")
        .goToRestfulBooker(pageHelper.adminPanelPage)
        .verifyLinkIsVisible("Rooms")
        .openNewTabInCurrentContext(pageHelper.blankPage)
        .goToRestfulBooker(pageHelper.adminPanelPage)
        .verifyLinkIsVisible("Rooms")
        .execute();
    });
    test(TestUtils.buildTestTitle(4, "Login page displayed, when the new tab is instantiated in a new context without storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .openNewTabInNewContext(pageHelper.blankPage, "administrator")
        .goToRestfulBooker(pageHelper.adminPanelPage)
        .verifyLinkIsVisible("Rooms")
        .openNewTabInNewContext(pageHelper.blankPage)
        .goToRestfulBooker(pageHelper.loginPage)
        .verifyLoginIsVisible()
        .execute();
    });
    test(TestUtils.buildTestTitle(5, "Admin Panel page displayed, when the new tab is instantiated in a new context with storageState"), async({ pageHelper }) => {
        await pageHelper.blankPage
        .openNewTabInNewContext(pageHelper.blankPage, "administrator")
        .goToRestfulBooker(pageHelper.adminPanelPage)
        .verifyLinkIsVisible("Rooms")
        .openNewTabInNewContext(pageHelper.blankPage, "administrator")
        .goToRestfulBooker(pageHelper.adminPanelPage)
        .verifyLinkIsVisible("Rooms")
        .execute();
    });
});
