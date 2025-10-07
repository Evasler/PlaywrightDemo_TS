import extendedTest from "../../src/fixtures/extendedTest.js";
import { roomsSteps, blankSteps, loginSteps } from "../../src/pages/index.js";
import { testUtils } from "../../src/utils/index.js";

extendedTest(
  testUtils.fullTitle(18, "Switch Working Tab", ["@fullScope"]),
  async ({ openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps)
      ._openNewTabInNewContext(blankSteps)
      .goToRestfulBookerAdminPage(loginSteps)
      .populateCredentials("administrator")
      .clickLogin(roomsSteps)
      .verifyLinkIsVisible("Rooms")
      ._switchWorkingTab(0, 0, blankSteps)
      .goToRestfulBookerAdminPage(loginSteps)
      .verifyLoginIsVisible()
      ._switchWorkingTab(1, 0, roomsSteps)
      ._execute();
  },
);
