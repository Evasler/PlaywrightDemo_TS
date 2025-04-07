import uiTest from "../../../src/fixtures/uiFixtures";
import TestUtils from "../../../src/utils/TestUtils";

uiTest(TestUtils.fullTitle(0, "Chained Page Object Model | StepSequenceBuilder"), async({ ui }) => {
    await ui
    ._openNewTabInNewContext(ui.pageHelper.blankPage)
    ._openNewTabInNewContext(ui.pageHelper.blankPage)
    .goToRestfulBooker(ui.pageHelper.loginPage)
    .populateCredentials("administrator")
    .clickLogin(ui.pageHelper.adminPanelPage)
    .verifyLinkIsVisible("Rooms")
    ._switchWorkingTab(0, 0, ui.pageHelper.blankPage)
    .goToRestfulBooker(ui.pageHelper.loginPage)
    .verifyLoginIsVisible()
    ._execute();
});