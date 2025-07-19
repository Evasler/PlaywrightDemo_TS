import extendedTest from "../../../../src/fixtures/extendedTest.js";
import { requestHelper } from "../../../../src/helpers/index.js";
import { authSteps } from "../../../../src/services/index.js";
import { testUtils } from "../../../../src/utils/index.js";

extendedTest(testUtils.fullTitle(0, "This Test should pass"), async() => {
    await requestHelper.openNewContext();
    await authSteps.login({ user: "administrator" });
});