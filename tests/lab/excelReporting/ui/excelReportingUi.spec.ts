import uiTest from "../../../../src/fixtures/uiFixtures";
import TestUtils from "../../../../src/utils/TestUtils";

uiTest(TestUtils.fullTitle(1, "This Test should fail"), async({ ui }) => {
    await ui
    .openNewTabInNewContext(ui.pageHelper.blankPage)
    .goToRestfulBooker(ui.pageHelper.adminPanelPage)
    .verifyLinkIsVisible("Rooms")
    .execute();
});