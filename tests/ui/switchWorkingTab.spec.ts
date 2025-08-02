import extendedTest from "../../src/fixtures/extendedTest.js";
import {
  adminPanelSteps,
  blankSteps,
  loginSteps,
} from "../../src/pages/index.js";
import { testUtils } from "../../src/utils/index.js";

extendedTest(
  testUtils.fullTitle(17, "Switch Working Tab", ["@fullScope"]),
  async ({ openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps)
      ._openNewTabInNewContext(blankSteps)
      .goToRestfulBookerAdminPage(loginSteps)
      .populateCredentials("administrator")
      .clickLogin(adminPanelSteps)
      .verifyLinkIsVisible("Rooms")
      ._switchWorkingTab(0, 0, blankSteps)
      .goToRestfulBookerAdminPage(loginSteps)
      .verifyLoginIsVisible()
      ._switchWorkingTab(1, 0, adminPanelSteps)
      ._execute();
  },
);
