import uiTest from "../../../src/fixtures/uiFixtures";
import TestUtils from "../../../src/utils/TestUtils";

uiTest(TestUtils.fullTitle(0, "Chained Page Object Model | StepSequenceBuilder"), async({ ui }) => {
    await ui
    ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps)
    ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps)
    .goToRestfulBooker(ui.pageStepsHelper.loginSteps)
    .populateCredentials("administrator")
    .clickLogin(ui.pageStepsHelper.adminPanelSteps)
    .verifyLinkIsVisible("Rooms")
    ._switchWorkingTab(0, 0, ui.pageStepsHelper.blankSteps)
    .goToRestfulBooker(ui.pageStepsHelper.loginSteps)
    .verifyLoginIsVisible()
    ._execute();
});