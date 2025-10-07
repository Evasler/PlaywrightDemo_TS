import extendedTest from "../../src/fixtures/extendedTest.js";
import {
  reportSteps,
  roomsSteps,
  blankSteps,
  loginSteps,
} from "../../src/pages/index.js";
import { testUtils } from "../../src/utils/index.js";

extendedTest.use({
  errorListenerOptions: {
    failOnConnectionError: false,
    failOnJsError: true,
    failOnRequestError: true,
  },
});
extendedTest(
  testUtils.fullTitle(20, "Verify Tab Types", ["@fullScope"]),
  async ({ openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps, "administrator")
      .goToRestfulBookerAdminPage(roomsSteps)
      .clickReportLink(reportSteps)
      ._openNewTabInCurrentContext(blankSteps)
      .goToRestfulBookerAdminPage(roomsSteps)
      ._openNewTabInNewContext(blankSteps)
      .goToRestfulBookerAdminPage(loginSteps)
      ._switchWorkingTab(0, 0, reportSteps)
      ._switchWorkingTab(0, 1, roomsSteps)
      ._switchWorkingTab(1, 0, loginSteps)
      ._execute();
  },
);
