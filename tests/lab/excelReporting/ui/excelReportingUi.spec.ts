import uiTest from "../../../../src/fixtures/uiFixtures";
import TestUtils from "../../../../src/utils/TestUtils";

uiTest(TestUtils.fullTitle(1, "This Test should fail"), async({ ui }) => {
    await ui
    ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps)
    .goToRestfulBooker(ui.pageStepsHelper.adminPanelSteps)
    .verifyLinkIsVisible("Rooms")
    ._execute();
});