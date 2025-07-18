import extendedTest from "../../../../src/fixtures/extendedTest.js";
import blankSteps from "../../../../src/pages/blank/blankSteps.js";
import adminPanelSteps from "../../../../src/pages/restfulBooker/adminPanel/adminPanelSteps.js";
import testUtils from "../../../../src/utils/testUtils.js";

extendedTest(testUtils.fullTitle(1, "This Test should fail"), async({ openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps)
    .goToRestfulBookerAdminPage(adminPanelSteps)
    .verifyLinkIsVisible("Rooms")
    ._execute();
});