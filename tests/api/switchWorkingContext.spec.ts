import { openNewContext, switchWorkingContext } from "playwrap";
import extendedTest from "../../src/fixtures/extendedTest.js";
import { authSteps } from "../../src/services/index.js";
import { testUtils } from "../../src/utils/index.js";

extendedTest(
  testUtils.fullTitle(4, "Switch Working Context", ["@fullScope"]),
  async () => {
    await openNewContext();
    await openNewContext();
    await authSteps.login("administrator");
    await switchWorkingContext(0);
    await authSteps.login("administrator");
  },
);
