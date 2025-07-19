import extendedTest from "../../../../src/fixtures/extendedTest.js";
import { adminPanelSteps, blankSteps } from "../../../../src/pages/index.js";
import { testUtils } from "../../../../src/utils/index.js";

extendedTest(testUtils.fullTitle(1, "This Test should fail"), async({ openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps)
    .goToRestfulBookerAdminPage(adminPanelSteps)
    .verifyLinkIsVisible("Rooms")
    ._execute();
});