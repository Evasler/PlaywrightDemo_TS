import extendedTest from "../../src/fixtures/extendedTest.js";
import requestHelper from "../../src/helpers/channel/requestHelper.js";
import { authSteps } from "../../src/services/index.js";
import { testUtils } from "../../src/utils/index.js";

extendedTest(
  testUtils.fullTitle(4, "Switch Working Context", ["@fullScope"]),
  async () => {
    await requestHelper.openNewContext();
    await requestHelper.openNewContext();
    await authSteps.login("administrator");
    await requestHelper.switchWorkingContext(0);
    await authSteps.login("administrator");
  },
);
