import extendedTest from "../../../../src/fixtures/extendedTest";
import blankSteps from "../../../../src/pages/blank/blankSteps";
import adminPanelSteps from "../../../../src/pages/restfulBooker/adminPanel/adminPanelSteps";
import testUtils from "../../../../src/utils/testUtils";

extendedTest(testUtils.fullTitle(1, "This Test should fail"), async({ openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps)
    .goToRestfulBookerAdminPage(adminPanelSteps)
    .verifyLinkIsVisible("Rooms")
    ._execute();
});