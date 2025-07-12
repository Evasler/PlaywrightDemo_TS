import uiTest from "../../../../src/fixtures/uiFixtures";
import stepSequenceHelper from "../../../../src/helpers/chaining/stepSequenceHelper";
import browserHelper from "../../../../src/helpers/channel/browserHelper";
import blankSteps from "../../../../src/pages/Blank/BlankSteps";
import adminPanelSteps from "../../../../src/pages/restfulBooker/adminPanel/adminPanelSteps";
import testUtils from "../../../../src/utils/testUtils";

uiTest(testUtils.fullTitle(1, "This Test should fail"), async() => {
    browserHelper.openNewTabInNewContext();
    blankSteps
    .goToRestfulBookerAdminPage(adminPanelSteps)
    .verifyLinkIsVisible("Rooms");
    await stepSequenceHelper.stepSequence;
});