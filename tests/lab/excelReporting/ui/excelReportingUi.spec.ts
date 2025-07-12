import uiTest from "../../../../src/fixtures/uiFixtures";
import stepSequenceHelper from "../../../../src/helpers/chaining/StepSequenceHelper";
import browserHelper from "../../../../src/helpers/channel/BrowserHelper";
import blankSteps from "../../../../src/pages/Blank/BlankSteps";
import adminPanelSteps from "../../../../src/pages/RestfulBooker/AdminPanel/AdminPanelSteps";
import testUtils from "../../../../src/utils/TestUtils";

uiTest(testUtils.fullTitle(1, "This Test should fail"), async() => {
    browserHelper.openNewTabInNewContext();
    blankSteps
    .goToRestfulBookerAdminPage(adminPanelSteps)
    .verifyLinkIsVisible("Rooms");
    await stepSequenceHelper.stepSequence;
});